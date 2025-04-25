import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';

interface Ocorrencia {
  created_at: string;  // Usando created_at como identificador único
  titulo?: string;
  status?: string;
  endereco?: string;
  setor?: string;
  foto_url?: string;
  latitude?: number;
  longitude?: number;
  vereador_id?: string;
  descricao?: string;
}

export default function VerOcorrenciasScreen() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);

  useEffect(() => {
    fetchOcorrencias();
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('ocorrencias-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ocorrencias' },
        (payload) => {
          console.log('Recebeu evento:', payload.eventType, payload.new, payload.old);
          
          if (payload.eventType === 'INSERT') {
            const novaOcorrencia = payload.new as Ocorrencia;
            setOcorrencias((prev) => [novaOcorrencia, ...prev]);
          } 
          else if (payload.eventType === 'UPDATE') {
            const ocorrenciaAtualizada = payload.new as Ocorrencia;
            if (ocorrenciaAtualizada && ocorrenciaAtualizada.created_at) {
              setOcorrencias((prev) => 
                prev.map((item) => 
                  item.created_at === ocorrenciaAtualizada.created_at ? ocorrenciaAtualizada : item
                )
              );
              
              // Atualiza a ocorrência selecionada se ela estiver aberta no modal
              if (selectedOcorrencia?.created_at === ocorrenciaAtualizada.created_at) {
                setSelectedOcorrencia(ocorrenciaAtualizada);
              }
            }
          } 
          else if (payload.eventType === 'DELETE') {
            const ocorrenciaDeletada = payload.old as Ocorrencia;
          
            if (ocorrenciaDeletada && ocorrenciaDeletada.created_at) {
              setOcorrencias((prev) =>
                prev.filter((item) => item.created_at !== ocorrenciaDeletada.created_at)
              );
          
              // ✅ Notifica no console que a ocorrência foi removida
              console.log(`Ocorrência deletada: ${ocorrenciaDeletada.titulo || 'Sem título'}`);
          
              // Fecha o modal se a ocorrência exibida for deletada
              if (selectedOcorrencia?.created_at === ocorrenciaDeletada.created_at) {
                setModalVisible(false);
                setSelectedOcorrencia(null);
              }
            }
          }
          
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedOcorrencia]);

  async function fetchOcorrencias() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ocorrencias')
        .select('created_at, status, titulo')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOcorrencias(data || []);
    } catch (error) {
      console.error('Error fetching occurrences:', error);
      setError('Falha ao carregar ocorrências. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchOcorrenciaDetalhes(created_at: string) {
    try {
      setDetalhesLoading(true);
      
      const { data, error } = await supabase
        .from('ocorrencias')
        .select('*')
        .eq('created_at', created_at)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching occurrence details:', error);
      return null;
    } finally {
      setDetalhesLoading(false);
    }
  }
  
  const handleVerDetalhes = async (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia);
    setModalVisible(true);
    
    // Busca informações completas da ocorrência
    const detalhesCompletos = await fetchOcorrenciaDetalhes(ocorrencia.created_at);
    if (detalhesCompletos) {
      setSelectedOcorrencia(detalhesCompletos);
    }
  };

  const renderOcorrencia = ({ item }: { item: Ocorrencia }) => (
    <View style={styles.ocorrenciaItem}>
      <View style={styles.ocorrenciaInfo}>
        <Text style={styles.ocorrenciaTitulo}>
          {item.titulo || 'Sem título'}
        </Text>

        <Text style={styles.ocorrenciaStatus}>
          Status: {item.status || 'Sem status'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.detalhesButton}
        onPress={() => handleVerDetalhes(item)}
      >
        <Text style={styles.detalhesButtonText}>Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  // Usando created_at como chave única
  const keyExtractor = (item: Ocorrencia, index: number) => {
    return item.created_at || `ocorrencia-${index}`;
  };
  
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Data desconhecida';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dataString;
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/salto.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ocorrências enviadas</Text>
        </View>
        
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#00A3D9" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : ocorrencias.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma ocorrência encontrada.</Text>
          ) : (
            <FlatList
              data={ocorrencias}
              renderItem={renderOcorrencia}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        
        {/* Modal de Detalhes */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes da Ocorrência</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              
              {detalhesLoading ? (
                <ActivityIndicator size="large" color="#00A3D9" style={styles.modalLoading} />
              ) : !selectedOcorrencia ? (
                <Text style={styles.errorText}>Erro ao carregar detalhes.</Text>
              ) : (
                <ScrollView style={styles.detalhesContainer}>
                  <Text style={styles.detalhesLabel}>Título:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.titulo || 'Sem título'}</Text>
                  
                  <Text style={styles.detalhesLabel}>Status:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.status || 'Sem status'}</Text>
                  
                  <Text style={styles.detalhesLabel}>Endereço:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.endereco || 'Não informado'}</Text>
                  
                  <Text style={styles.detalhesLabel}>Vereador:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.vereador_nome || 'Não informado'}</Text>

                  <Text style={styles.detalhesLabel}>Setor:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.setor || 'Não informado'}</Text>
                  
                  <Text style={styles.detalhesLabel}>Descrição:</Text>
                  <Text style={styles.detalhesValue}>{selectedOcorrencia.descricao || 'Sem descrição'}</Text>
                  
                  <Text style={styles.detalhesLabel}>Data de Criação:</Text>
                  <Text style={styles.detalhesValue}>{formatarData(selectedOcorrencia.created_at)}</Text>                
                  
                  
                                                
                  <Text style={styles.detalhesLabel}>Foto:</Text>
                  {selectedOcorrencia.foto_url ? (
                    <Image 
                      source={{ uri: selectedOcorrencia.foto_url }} 
                      style={styles.ocorrenciaFoto}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.detalhesValue}>Nenhuma foto disponível</Text>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        
      </SafeAreaView>
    </ImageBackground>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A3D9',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  ocorrenciaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ocorrenciaInfo: {
    flex: 1,
  },
  ocorrenciaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ocorrenciaStatus: {
    fontSize: 14,
    color: '#555',
  },
  detalhesButton: {
    backgroundColor: '#00A3D9',
    borderRadius: 6,
    padding: 10,
    paddingHorizontal: 20,
  },
  detalhesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: windowWidth * 0.9,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A3D9',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  modalLoading: {
    padding: 30,
  },
  detalhesContainer: {
    padding: 15,
  },
  detalhesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  detalhesValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  ocorrenciaFoto: {
    width: '100%',
    height: 200,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
});