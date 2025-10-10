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
  Linking,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
// Importação dos ícones
import { Ionicons } from '@expo/vector-icons';

// Tipo para comercio
interface Comercio {
  id: string;
  nome: string;
  categoria: string;
  imagem?: any;
  destaque: boolean;
  endereco?: string;
  sobre?: string;
  whatsapp?: string;
  instagram?: string;
  mapa?: string;
  fotos?: string[];
}

// Lista de comércios fictícios com dados adicionais
const comercios: Comercio[] = [
  {
    id: '1',
    nome: 'Aluga Carro Locadora',
    categoria: 'Serviços',
    imagem: require('@/assets/images/marketplace/carro.jpg'),
    destaque: true,
    endereco: 'Av. Principal, 1234 - Centro',
    sobre: 'Locadora de veículos com as melhores opções para sua viagem ou necessidade diária.',
    whatsapp: '+5511999999999',
    instagram: 'alugacarro',
    mapa: 'https://maps.google.com/?q=Aluga+Carro+Locadora',
    fotos: [
      'carro.jpg',
      'carro_detalhe1.jpg',
      'carro_detalhe2.jpg',
      'carro_detalhe3.jpg',
      'carro_detalhe4.jpg',
      'carro_detalhe5.jpg'
    ]
  },
  {
    id: '2',
    nome: 'Historia Burger e Beer',
    categoria: 'Alimentação',
    imagem: require('@/assets/images/marketplace/burger.jpg'),
    destaque: true,
    endereco: 'Rua das Hamburguerias, 456 - Centro',
    sobre: 'Os melhores hambúrgueres artesanais da cidade, acompanhados de cervejas especiais.',
    whatsapp: '+5511988888888',
    instagram: 'historiaburger',
    mapa: 'https://maps.google.com/?q=Historia+Burger+e+Beer',
    fotos: [
      'burger.jpg',
      'burger_detalhe1.jpg',
      'burger_detalhe2.jpg',
      'burger_detalhe3.jpg',
      'burger_detalhe4.jpg',
      'burger_detalhe5.jpg'
    ]
  },
  {
    id: '3',
    nome: 'Pizzaria 430 Gradi',
    categoria: 'Alimentação',
    imagem: require('@/assets/images/marketplace/pizza.jpg'),
    destaque: true,
    endereco: 'Av. das Pizzas, 430 - Jardim Italiano',
    sobre: 'Pizzas artesanais ao estilo napolitano, feitas em forno a lenha importado da Itália.',
    whatsapp: '+5511977777777',
    instagram: '430gradi',
    mapa: 'https://maps.google.com/?q=Pizzaria+430+Gradi',
    fotos: [
      'pizza.jpg',
      'pizza_detalhe1.jpg',
      'pizza_detalhe2.jpg',
      'pizza_detalhe3.jpg',
      'pizza_detalhe4.jpg',
      'pizza_detalhe5.jpg'
    ]
  },
  {
    id: '4',
    nome: 'Academia Fitness Center',
    categoria: 'Esportes',
    destaque: false,
    endereco: 'Rua das Academias, 100 - Jardim Saúde',
    sobre: 'Academia completa com equipamentos modernos, aulas coletivas e personal trainers.',
    whatsapp: '+5511966666666',
    instagram: 'fitnesscenter',
    mapa: 'https://maps.google.com/?q=Academia+Fitness+Center',
    fotos: [
      'academia_detalhe1.jpg',
      'academia_detalhe2.jpg',
      'academia_detalhe3.jpg',
      'academia_detalhe4.jpg',
      'academia_detalhe5.jpg'
    ]
  },
  {
    id: '5',
    nome: 'Boutique Elegância',
    categoria: 'Vestuário',
    destaque: false,
    endereco: 'Rua da Moda, 789 - Centro',
    sobre: 'Loja de roupas e acessórios com as últimas tendências da moda nacional e internacional.',
    whatsapp: '+5511955555555',
    instagram: 'boutiqueelegancia',
    mapa: 'https://maps.google.com/?q=Boutique+Elegancia',
    fotos: [
      'boutique_detalhe1.jpg',
      'boutique_detalhe2.jpg',
      'boutique_detalhe3.jpg',
      'boutique_detalhe4.jpg',
      'boutique_detalhe5.jpg'
    ]
  },
  {
    id: '6',
    nome: 'Cafeteria Grão Nobre',
    categoria: 'Alimentação',
    destaque: false,
    endereco: 'Praça do Café, 123 - Centro Histórico',
    sobre: 'Cafeteria especializada em grãos selecionados, torrados artesanalmente e preparados com excelência.',
    whatsapp: '+5511944444444',
    instagram: 'graonobre',
    mapa: 'https://maps.google.com/?q=Cafeteria+Grao+Nobre',
    fotos: [
      'cafe_detalhe1.jpg',
      'cafe_detalhe2.jpg',
      'cafe_detalhe3.jpg',
      'cafe_detalhe4.jpg',
      'cafe_detalhe5.jpg'
    ]
  },
  {
    id: '7',
    nome: 'Farmácia Saúde Total',
    categoria: 'Saúde',
    destaque: false,
    endereco: 'Av. da Saúde, 500 - Jardim Vida',
    sobre: 'Farmácia completa com medicamentos, cosméticos e atendimento farmacêutico especializado.',
    whatsapp: '+5511933333333',
    instagram: 'saudetotal',
    mapa: 'https://maps.google.com/?q=Farmacia+Saude+Total',
    fotos: [
      'farmacia_detalhe1.jpg',
      'farmacia_detalhe2.jpg',
      'farmacia_detalhe3.jpg',
      'farmacia_detalhe4.jpg',
      'farmacia_detalhe5.jpg'
    ]
  },
  {
    id: '8',
    nome: 'Livraria Páginas',
    categoria: 'Cultura',
    destaque: false,
    endereco: 'Rua dos Livros, 321 - Centro Cultural',
    sobre: 'Livraria com amplo acervo de livros nacionais e importados, além de espaços para leitura e cafeteria.',
    whatsapp: '+5511922222222',
    instagram: 'livrariapaginas',
    mapa: 'https://maps.google.com/?q=Livraria+Paginas',
    fotos: [
      'livraria_detalhe1.jpg',
      'livraria_detalhe2.jpg',
      'livraria_detalhe3.jpg',
      'livraria_detalhe4.jpg',
      'livraria_detalhe5.jpg'
    ]
  },
  {
    id: '9',
    nome: 'Mercado do Bairro',
    categoria: 'Alimentação',
    destaque: false,
    endereco: 'Rua do Comércio, 555 - Vila Nova',
    sobre: 'Supermercado de bairro com produtos frescos, hortifruti selecionado e atendimento personalizado.',
    whatsapp: '+5511911111111',
    instagram: 'mercadodobairro',
    mapa: 'https://maps.google.com/?q=Mercado+do+Bairro',
    fotos: [
      'mercado_detalhe1.jpg',
      'mercado_detalhe2.jpg',
      'mercado_detalhe3.jpg',
      'mercado_detalhe4.jpg',
      'mercado_detalhe5.jpg'
    ]
  },
  {
    id: '10',
    nome: 'Ótica Visão Clara',
    categoria: 'Saúde',
    destaque: false,
    endereco: 'Av. dos Óculos, 222 - Jardim Ótico',
    sobre: 'Ótica com as melhores marcas de óculos de grau e de sol, além de exames de vista com oftalmologistas.',
    whatsapp: '+5511900000000',
    instagram: 'visaoclara',
    mapa: 'https://maps.google.com/?q=Otica+Visao+Clara',
    fotos: [
      'otica_detalhe1.jpg',
      'otica_detalhe2.jpg',
      'otica_detalhe3.jpg',
      'otica_detalhe4.jpg',
      'otica_detalhe5.jpg'
    ]
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

// Mapeamento de imagens para acessar no carrossel
const imagensMap = {
  'carro.jpg': require('@/assets/images/marketplace/carro.jpg'),
  'burger.jpg': require('@/assets/images/marketplace/burger.jpg'),
  'pizza.jpg': require('@/assets/images/marketplace/pizza.jpg'),
  'pizza_detalhe1.jpg': require('@/assets/images/marketplace/pizza_detalhe1.jpg'),
  'pizza_detalhe2.jpg': require('@/assets/images/marketplace/pizza_detalhe2.jpg'),
  'pizza_detalhe3.jpg': require('@/assets/images/marketplace/pizza_detalhe3.jpg'),
  'pizza_detalhe4.jpg': require('@/assets/images/marketplace/pizza_detalhe4.jpg'),
  'pizza_detalhe5.jpg': require('@/assets/images/marketplace/pizza_detalhe5.jpg'),
  'carro_detalhe1.jpg': require('@/assets/images/marketplace/carro_detalhe1.jpg'),
  'carro_detalhe2.jpg': require('@/assets/images/marketplace/carro_detalhe2.jpg'),
  'carro_detalhe3.jpg': require('@/assets/images/marketplace/carro_detalhe3.jpg'),
  'carro_detalhe4.jpg': require('@/assets/images/marketplace/carro_detalhe4.jpg'),
  'carro_detalhe5.jpg': require('@/assets/images/marketplace/carro_detalhe5.jpg'),
  'burger_detalhe1.jpg': require('@/assets/images/marketplace/burger_detalhe1.jpg'),
  'burger_detalhe2.jpg': require('@/assets/images/marketplace/burger_detalhe2.jpg'),
  'burger_detalhe3.jpg': require('@/assets/images/marketplace/burger_detalhe3.jpg'),
  'burger_detalhe4.jpg': require('@/assets/images/marketplace/burger_detalhe4.jpg'),
  'burger_detalhe5.jpg': require('@/assets/images/marketplace/burger_detalhe5.jpg'),
  'academia_detalhe1.jpg': require('@/assets/images/marketplace/academia_detalhe1.jpg'),
  'academia_detalhe2.jpg': require('@/assets/images/marketplace/academia_detalhe2.jpg'),
  'academia_detalhe3.jpg': require('@/assets/images/marketplace/academia_detalhe3.jpg'),
  'academia_detalhe4.jpg': require('@/assets/images/marketplace/academia_detalhe4.jpg'),
  'academia_detalhe5.jpg': require('@/assets/images/marketplace/academia_detalhe5.jpg'),
  'boutique_detalhe1.jpg': require('@/assets/images/marketplace/boutique_detalhe1.jpg'),
  'boutique_detalhe2.jpg': require('@/assets/images/marketplace/boutique_detalhe2.jpg'),
  'boutique_detalhe3.jpg': require('@/assets/images/marketplace/boutique_detalhe3.jpg'),
  'boutique_detalhe4.jpg': require('@/assets/images/marketplace/boutique_detalhe4.jpg'),
  'boutique_detalhe5.jpg': require('@/assets/images/marketplace/boutique_detalhe5.jpg'),
  'cafe_detalhe1.jpg': require('@/assets/images/marketplace/cafe_detalhe1.jpg'),
  'mercado_detalhe1.jpg': require('@/assets/images/marketplace/mercado_detalhe1.jpg'),
  'otica_detalhe1.jpg': require('@/assets/images/marketplace/otica_detalhe1.jpg'),
  'livraria_detalhe1.jpg': require('@/assets/images/marketplace/livraria_detalhe1.jpg'),
  'farmacia_detalhe1.jpg': require('@/assets/images/marketplace/farmacia_detalhe1.jpg'),
};

export default function MarketplaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [comerciosFiltrados, setComerciosFiltrados] = useState<Comercio[]>([...comercios]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [comercioSelecionado, setComercioSelecionado] = useState<Comercio | null>(null);
  const [fotoAtualIndex, setFotoAtualIndex] = useState(0);
  
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
  
  const abrirDetalheComercio = (comercio: Comercio) => {
    setComercioSelecionado(comercio);
    setFotoAtualIndex(0);
    setModalDetalhesVisible(true);
  };
  
  const abrirWhatsApp = (numero: string | undefined) => {
    if (numero) {
      Linking.openURL(`whatsapp://send?phone=${numero}`);
    }
  };
  
  const abrirInstagram = (instagram: string | undefined) => {
    if (instagram) {
      Linking.openURL(`https://www.instagram.com/${instagram}`);
    }
  };
  
  const abrirMapa = (mapa: string | undefined) => {
    if (mapa) {
      Linking.openURL(mapa);
    }
  };
  
  const proximaFoto = () => {
    if (comercioSelecionado?.fotos && fotoAtualIndex < comercioSelecionado.fotos.length - 1) {
      setFotoAtualIndex(fotoAtualIndex + 1);
    } else {
      setFotoAtualIndex(0);
    }
  };
  
  const fotoAnterior = () => {
    if (comercioSelecionado?.fotos && fotoAtualIndex > 0) {
      setFotoAtualIndex(fotoAtualIndex - 1);
    } else if (comercioSelecionado?.fotos) {
      setFotoAtualIndex(comercioSelecionado.fotos.length - 1);
    }
  };
  
  const renderFotoAtual = () => {
    if (!comercioSelecionado?.fotos || comercioSelecionado.fotos.length === 0) {
      return (
        <View style={styles.imagemPlaceholder}>
          <Text style={styles.imagemPlaceholderText}>Sem imagens disponíveis</Text>
        </View>
      );
    }
    
    const fotoNome = comercioSelecionado.fotos[fotoAtualIndex];
    
    try {
      // Usar o mapeamento de imagens para buscar a imagem correta
      const fotoSource = imagensMap[fotoNome as keyof typeof imagensMap] || null;
      
      return (
        <View style={styles.galeriaContainer}>
          {fotoSource ? (
            <Image 
              source={fotoSource}
              style={styles.galeriaImagem}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <Text style={styles.imagemPlaceholderText}>Imagem: {fotoNome}</Text>
            </View>
          )}
          
          <View style={styles.galeriaControles}>
            <TouchableOpacity onPress={fotoAnterior} style={styles.galeriaButton}>
              <Text style={styles.galeriaButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.galeriaContador}>
              {fotoAtualIndex + 1}/{comercioSelecionado.fotos.length}
            </Text>
            <TouchableOpacity onPress={proximaFoto} style={styles.galeriaButton}>
              <Text style={styles.galeriaButtonText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (e) {
      return (
        <View style={styles.imagemPlaceholder}>
          <Text style={styles.imagemPlaceholderText}>Imagem: {fotoNome}</Text>
        </View>
      );
    }
  };  
  const renderDestaqueItem = ({ item }: { item: Comercio }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.destaqueCard}
      onPress={() => abrirDetalheComercio(item)}
    >
      <View style={styles.destaqueContent}>
        {item.imagem ? (
          <Image 
            source={item.imagem}
            style={styles.destaqueImagem}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.destaqueImagem, styles.imagemPlaceholder]}>
            <Text style={styles.imagemPlaceholderText}>{item.nome[0]}</Text>
          </View>
        )}
        <Text style={styles.destaqueNome}>{item.nome}</Text>
      </View>
      <View style={styles.destaqueTag}>
        <Text style={styles.destaqueTagText}>Destaque</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderRegularItem = ({ item }: { item: Comercio }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.regularCard}
      onPress={() => abrirDetalheComercio(item)}
    >
      <Text style={styles.regularNome}>{item.nome}</Text>
      <Text style={styles.regularCategoria}>{item.categoria}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('@/assets/images/mirante.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>
          <Text style={styles.title}>Marketplace de Mirante do Paranapanema</Text>
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
          
          {/* Modal de Detalhes do Comércio */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalDetalhesVisible}
            onRequestClose={() => setModalDetalhesVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalDetalhesContent}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalDetalhesVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
                
                {comercioSelecionado && (
                  <ScrollView style={styles.detalhesScrollView}>
                    <Text style={styles.detalhesNome}>{comercioSelecionado.nome}</Text>
                    <Text style={styles.detalhesCategoria}>{comercioSelecionado.categoria}</Text>
                    
                    {renderFotoAtual()}
                    
                    <View style={styles.detalhesSection}>
                      <Text style={styles.detalhesLabel}>Endereço:</Text>
                      <Text style={styles.detalhesTexto}>{comercioSelecionado.endereco}</Text>
                    </View>
                    
                    <View style={styles.detalhesSection}>
                      <Text style={styles.detalhesLabel}>Sobre:</Text>
                      <Text style={styles.detalhesTexto}>{comercioSelecionado.sobre}</Text>
                    </View>
                    
                    <View style={styles.botoesContainer}>
                      <TouchableOpacity 
                        style={[styles.botaoContato, styles.botaoWhatsapp]}
                        onPress={() => abrirWhatsApp(comercioSelecionado.whatsapp)}
                      >
                        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.botaoContato, styles.botaoInstagram]}
                        onPress={() => abrirInstagram(comercioSelecionado.instagram)}
                      >
                        <Ionicons name="logo-instagram" size={24} color="#fff" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.botaoContato, styles.botaoMapa]}
                        onPress={() => abrirMapa(comercioSelecionado.mapa)}
                      >
                        <Ionicons name="location" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
          
          <ScrollView style={styles.scrollView}>
            {comerciosFiltrados
              .filter(item => item.destaque)
              .map(item => renderDestaqueItem({ item }))}
              
            {comerciosFiltrados
              .filter(item => !item.destaque)
              .map(item => renderRegularItem({ item }))}
              
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    marginTop: 30,
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
    position: 'relative',
  },
  destaqueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  destaqueImagem: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  destaqueNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    flex: 1,
  },
  destaqueTag: {
    backgroundColor: '#00A3D9',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  destaqueTagText: {
    color: '#fff',
    fontSize: 14,
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
  },
  
  // Estilos para o modal de detalhes
  modalDetalhesContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#001F54',
    fontWeight: 'bold',
  },
  detalhesScrollView: {
    marginTop: 10,
  },
  detalhesNome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001F54',
    marginTop: 20,
    marginBottom: 5,
  },
  detalhesCategoria: {
    fontSize: 16,
    color: '#00A3D9',
    marginBottom: 15,
    fontWeight: '500',
  },
  galeriaContainer: {
    width: '100%',
    height: 300,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  galeriaImagem: {
    width: '100%',
    height: 250,
  },
  galeriaControles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  galeriaButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galeriaButtonText: {
    fontSize: 24,
    color: '#001F54',
    fontWeight: 'bold',
  },
  galeriaContador: {
    fontSize: 14,
    color: '#666',
  },
  imagemPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 180,
  },
  imagemPlaceholderText: {
    fontSize: 16,
    color: '#999',
  },
  detalhesSection: {
    marginBottom: 15,
  },
  detalhesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001F54',
    marginBottom: 5,
  },
  detalhesTexto: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  botaoContato: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  botaoWhatsapp: {
    backgroundColor: '#25D366',
  },
  botaoInstagram: {
    backgroundColor: '#E1306C',
  },
  botaoMapa: {
    backgroundColor: '#4285F4',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});