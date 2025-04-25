import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from 'lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';


export default function EnviarOcorrenciaScreen() {
  // Capturar os parâmetros da rota
  const params = useLocalSearchParams();
  const vereadorId = params.vereadorId as string;
  const vereadorNome = params.vereadorNome as string;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [setor, setSetor] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Estados para o dropdown personalizado
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Lista completa de setores
  const setores = [
    "Infraestrutura", 
    "Saúde", 
    "Segurança", 
    "Meio Ambiente", 
    "Iluminação Pública", 
    "Educação", 
    "Transporte", 
    "Saneamento", 
    "Assistência Social", 
    "Defesa Civil", 
    
  ];

  useEffect(() => {
    const checkPermissions = async () => {
      // Verificar permissões de mídia
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
      
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
      
      // Verificar permissão de localização
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status === 'granted');
      
      // Se a permissão de localização foi concedida, obter localização atual
      if (locationStatus.status === 'granted') {
        obterLocalizacaoAtual();
      }
    };

    checkPermissions();
  }, []);

  const obterLocalizacaoAtual = async () => {
    if (!locationPermission) {
      Alert.alert('Permissão necessária', 'É preciso permissão para acessar a localização do dispositivo.');
      return;
    }

    try {
      setLocationLoading(true);
      // Obter localização atual com alta precisão
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      // Opcional: Obter endereço baseado nas coordenadas
      const enderecoInfo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (enderecoInfo && enderecoInfo.length > 0) {
        const info = enderecoInfo[0];
        const enderecoCompleto = [
          info.street,
          info.streetNumber,
          info.district,
          info.city,
          info.region,
          info.postalCode
        ].filter(Boolean).join(', ');
        
        // Preencher o campo de endereço automaticamente se estiver vazio
        if (!endereco) {
          setEndereco(enderecoCompleto);
        }
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro", "Não foi possível obter sua localização. Por favor, verifique as permissões.");
    } finally {
      setLocationLoading(false);
    }
  };

  const comprimirImagem = async (uri: string): Promise<string> => {
    try {
      // Redimensionar para largura máxima de 800px mantendo proporção
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Verificar o tamanho do arquivo
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      if (fileInfo.exists && fileInfo.size) {
        console.log(`Imagem comprimida: ${Math.round(fileInfo.size / 1024)} KB`);
      }
      
      return result.uri;
    } catch (error) {
      console.error("Erro ao comprimir a imagem:", error);
      // Em caso de erro, retorna a imagem original
      return uri;
    }
  };

  const selecionarDaGaleria = async () => {
    if (!galleryPermission) {
      Alert.alert('Permissão necessária', 'É preciso permissão para acessar a galeria.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await comprimirImagem(result.assets[0].uri);
        setFoto(compressedUri);
      }
    } catch (error) {
      console.error("Erro ao selecionar da galeria:", error);
      Alert.alert("Erro", "Não foi possível selecionar a foto.");
    }
  };

  const tirarFoto = async () => {
    if (!cameraPermission) {
      Alert.alert('Permissão necessária', 'É preciso permissão para acessar a câmera.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await comprimirImagem(result.assets[0].uri);
        setFoto(compressedUri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível capturar a foto.");
    }
  };

  const escolherOpcaoFoto = () => {
    Alert.alert(
      "Adicionar Foto",
      "Escolha uma opção",
      [
        { text: "Tirar Foto", onPress: tirarFoto },
        { text: "Escolher da Galeria", onPress: selecionarDaGaleria },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const uploadFoto = async (uri: string) => {
    try {
      // Obter extensão do arquivo
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `ocorrencias/${fileName}`;

      // Determinar o tipo MIME
      let mimeType = 'image/jpeg';
      if (fileExt === 'png') mimeType = 'image/png';
      else if (fileExt === 'gif') mimeType = 'image/gif';

      // Criar objeto File (simulado para React Native)
      const file = {
        uri,
        name: fileName,
        type: mimeType,
      };

      // Fazer upload usando o objeto File
      const { error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(filePath, file as any, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro completo no upload:', {
        error,
        time: new Date().toISOString()
      });
      throw new Error('Falha no upload da imagem. Verifique sua conexão e tente novamente.');
    }
  };

  const handleEnviar = async () => {
    if (loading) return;
    
    if (!titulo || !descricao || !endereco || !setor) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // Se não tiver localização, tentar obter antes de enviar
    if (!location) {
      Alert.alert(
        'Localização',
        'Deseja tentar obter sua localização atual?',
        [
          {
            text: 'Sim',
            onPress: async () => {
              await obterLocalizacaoAtual();
              // Continuar o envio após obter localização
              processarEnvio();
            }
          },
          {
            text: 'Não',
            onPress: () => {
              // Continuar sem localização
              processarEnvio();
            }
          }
        ]
      );
    } else {
      // Já tem localização, continuar com o envio
      processarEnvio();
    }
  };

  const processarEnvio = async () => {
    try {
      setLoading(true);
      
      let fotoUrl = null;
      if (foto) {
        try {
          fotoUrl = await uploadFoto(foto);
        } catch (uploadError) {
          console.warn('Upload falhou:', uploadError);
          Alert.alert('Aviso', 'A foto não pôde ser enviada, mas a ocorrência será registrada sem imagem.');
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (!userId) {
        Alert.alert('Erro', 'Você precisa estar logado para enviar uma ocorrência.');
        router.replace('/');
        return;
      }

      // Objeto base da ocorrência - apenas com vereador_id
      const ocorrenciaData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        endereco: endereco.trim(),
        setor: setor.trim(),
        foto_url: fotoUrl,
        status: 'Enviado',
        vereador_id: vereadorId, // Apenas o ID do vereador
        vereador_nome: vereadorNome,
      };

      // Adicionar coordenadas geográficas se disponíveis
      if (location) {
        Object.assign(ocorrenciaData, {
          latitude: location.latitude,
          longitude: location.longitude
        });
      }

      const { error } = await supabase
        .from('ocorrencias')
        .insert(ocorrenciaData);

      if (error) {
        console.error('Erro ao enviar ocorrência:', error.message);
        Alert.alert('Erro', error.message);
        return;
      }

      // Reset do formulário após envio
      setTitulo('');
      setDescricao('');
      setEndereco('');
      setSetor('');
      setFoto(null);
      setLocation(null);
      
      Alert.alert('Sucesso', 'Ocorrência enviada com sucesso!');
    } catch (err) {
      console.error('Erro inesperado:', err);
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Enviar ocorrência</Text>
            <Text style={styles.headerSubtitle}>Preencha com o máximo de detalhes possível</Text>
          </View>
          
          {/* Exibir informação do vereador selecionado */}
          {vereadorNome && (
            <View style={styles.vereadorContainer}>
              <Text style={styles.vereadorLabel}>Vereador selecionado:</Text>
              <Text style={styles.vereadorNome}>{vereadorNome}</Text>
            </View>
          )}
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Título da ocorrência</Text>
            <TextInput
              style={styles.input}
              placeholder="EX: Buraco na rua"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Descrição da ocorrência</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Detalhe a ocorrência"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <Text style={styles.label}>Endereço da ocorrência</Text>
            <TextInput
              style={styles.input}
              placeholder="Endereço da ocorrência"
              value={endereco}
              onChangeText={setEndereco}
            />

            <View style={styles.localizacaoContainer}>
              <TouchableOpacity 
                style={styles.localizacaoButton} 
                onPress={obterLocalizacaoAtual}
                disabled={locationLoading}
              >
                <Text style={styles.buttonTextSmall}>
                  {locationLoading ? 'Obtendo...' : 'Obter Localização Atual'}
                </Text>
              </TouchableOpacity>
              {location && (
                <View style={styles.coordenadasContainer}>
                  <Text style={styles.coordenadasText}>
                    Localização obtida: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.label}>Setor</Text>
            {/* Dropdown de Setores */}
            <TouchableOpacity 
              style={styles.selectContainer}
              onPress={() => setDropdownVisible(true)}
            >
              <TextInput
                style={[styles.input, styles.selectInput]}
                placeholder="Escolha o setor"
                value={setor}
                editable={false}
              />
              <View style={styles.selectArrow}>
                <Text style={{ fontSize: 16 }}>▼</Text>
              </View>
            </TouchableOpacity>

            {/* Modal para o dropdown de setores */}
            <Modal
               visible={dropdownVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDropdownVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setDropdownVisible(false)}
              >
                <View style={styles.dropdownContainer}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownTitle}>Selecione o Setor</Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                      <Text style={styles.closeButton}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.dropdownScrollView}>
                    {setores.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSetor(item);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          setor === item && styles.dropdownItemSelected
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
        </Modal>

            <Text style={styles.label}>Foto da ocorrência</Text>
            <View style={styles.fotoContainer}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.fotoPreview} resizeMode="cover" />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Text style={{ color: '#888' }}>Nenhuma foto selecionada</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={escolherOpcaoFoto}
            >
              <Text style={styles.buttonText}>Adicionar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.enviarButton, loading && { opacity: 0.7 }]} 
              onPress={handleEnviar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Ocorrência'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e2356',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  // Estilos para o componente de vereador selecionado
  vereadorContainer: {
    backgroundColor: '#f0f6ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c0d1e8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vereadorLabel: {
    fontSize: 14,
    color: '#0e2356',
    fontWeight: '500',
  },
  vereadorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e2356',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  selectContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  selectInput: {
    marginBottom: 0,
  },
  selectArrow: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  fotoContainer: {
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  cameraButton: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  enviarButton: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  localizacaoContainer: {
    marginBottom: 15,
  },
  localizacaoButton: {
    backgroundColor: '#3D7E9A',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 10,
  },
  coordenadasContainer: {
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c0e0f0',
  },
  coordenadasText: {
    fontSize: 12,
    color: '#0D4D8F',
  },
  // Estilos para o dropdown personalizado
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Removido maxHeight para permitir que o container cresça conforme necessário
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e2356',
  },
  closeButton: {
    fontSize: 16,
    color: '#00A3D9',
    fontWeight: '500',
  },
  dropdownContent: {
    // Substituindo o ScrollView por uma View normal
    width: '100%',
  },
  dropdownItem: {
    padding: 12, // Reduzido um pouco para caber mais itens
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemSelected: {
    color: '#00A3D9',
    fontWeight: 'bold',
  },
});