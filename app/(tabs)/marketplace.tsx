import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ImageBackground, 
  TextInput, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal,
  FlatList,
  ImageSourcePropType
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Lista de comércios fictícios
const comercios = [
  {
    id: '1',
    nome: 'Aluga Carro Locadora',
    categoria: 'Serviços',
    imagem: require('@/assets/images/marketplace/carro.jpg'),
    destaque: true
  },
  {
    id: '2',
    nome: 'Historia Burger e Beer',
    categoria: 'Alimentação',
    imagem: require('@/assets/images/marketplace/burger.jpg'),
    destaque: true
  },
  {
    id: '3',
    nome: 'Pizzaria 430 Gradi',
    categoria: 'Alimentação',
    imagem: require('@/assets/images/marketplace/pizza.jpg'),
    destaque: true
  },
  {
    id: '4',
    nome: 'Academia Fitness Center',
    categoria: 'Esportes',
    destaque: false
  },
  {
    id: '5',
    nome: 'Boutique Elegância',
    categoria: 'Vestuário',
    destaque: false
  },
  {
    id: '6',
    nome: 'Cafeteria Grão Nobre',
    categoria: 'Alimentação',
    destaque: false
  },
  {
    id: '7',
    nome: 'Farmácia Saúde Total',
    categoria: 'Saúde',
    destaque: false
  },
  {
    id: '8',
    nome: 'Livraria Páginas',
    categoria: 'Cultura',
    destaque: false
  },
  {
    id: '9',
    nome: 'Mercado do Bairro',
    categoria: 'Alimentação',
    destaque: false
  },
  {
    id: '10',
    nome: 'Ótica Visão Clara',
    categoria: 'Saúde',
    destaque: false
  },
];

// Lista de categorias
const categorias = [
  'Todas',
  'Alimentação',
  'Cultura',
  'Esportes',
  'Saúde',
  'Serviços',
  'Vestuário'
];

export default function MarketplaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [comerciosFiltrados, setComerciosFiltrados] = useState([...comercios]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const normalizeText = (text: string) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };
  
  useEffect(() => {
    const filtered = comercios.filter(comercio => {
      const nomeNormalizado = normalizeText(comercio.nome);
      const searchNormalizado = normalizeText(searchText);
      const matchesSearch = nomeNormalizado.includes(searchNormalizado);
      
      const matchesCategoria = selectedCategoria === 'Todas' || comercio.categoria === selectedCategoria;
      
      return matchesSearch && matchesCategoria;
    });
    
    const destaques = filtered.filter(item => item.destaque);
    const naoDestaques = filtered.filter(item => !item.destaque)
      .sort((a, b) => a.nome.localeCompare(b.nome));
      
    for (let i = destaques.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [destaques[i], destaques[j]] = [destaques[j], destaques[i]];
    }
    
    setComerciosFiltrados([...destaques, ...naoDestaques]);
  }, [searchText, selectedCategoria]);
  
  const renderDestaqueItem = ({ id, imagem, nome }: { id: string; imagem?: any; nome: string }) => (
    <TouchableOpacity key={id} style={styles.destaqueCard}>
      <Image 
        source={imagem}
        style={styles.destaqueImagem}
        resizeMode="cover"
      />
      <View style={styles.destaqueInfoContainer}>
        <Text style={styles.destaqueNome}>{nome}</Text>
        <View style={styles.destaqueTag}>
          <Text style={styles.destaqueTagText}>Destaque</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderRegularItem = ({ id, nome, categoria }: { id: string; nome: string; categoria: string }) => (
    <TouchableOpacity key={id} style={styles.regularCard}>
      <Text style={styles.regularNome}>{nome}</Text>
      <Text style={styles.regularCategoria}>{categoria}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('@/assets/images/salto.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>
          <Text style={styles.title}>MARKETPLACE</Text>
          <Text style={styles.subtitle}>
            Aqui você encontra tudo o que sua cidade tem a oferecer.
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar comércio..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              Categoria: {selectedCategoria}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione a Categoria</Text>
                <FlatList
                  data={categorias}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoriaItem,
                        selectedCategoria === item && styles.categoriaItemSelected
                      ]}
                      onPress={() => {
                        setSelectedCategoria(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text 
                        style={[
                          styles.categoriaItemText,
                          selectedCategoria === item && styles.categoriaItemTextSelected
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
          
          <ScrollView style={styles.scrollView}>
            {comerciosFiltrados
              .filter(item => item.destaque)
              .map(renderDestaqueItem)}
              
            {comerciosFiltrados
              .filter(item => !item.destaque)
              .map(renderRegularItem)}
              
            {comerciosFiltrados.length === 0 && (
              <Text style={styles.noResults}>
                Nenhum comércio encontrado com esses filtros.
              </Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001F54',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001F54',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoriaItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriaItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  categoriaItemText: {
    fontSize: 16,
    color: '#333',
  },
  categoriaItemTextSelected: {
    color: '#00A3D9',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  destaqueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  destaqueImagem: {
    width: 80,
    height: 80,
  },
  destaqueInfoContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destaqueNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001F54',
    flex: 1,
  },
  destaqueTag: {
    backgroundColor: '#00A3D9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  destaqueTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  regularCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00A3D9',
  },
  regularNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  regularCategoria: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});