import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface Vereador {
  id: string;
  nome: string;
  imagemUrl: any;
}

export default function VereadoresScreen() {
  const vereadores: Vereador[] = [
    { id: 'm1', nome: 'Almir do Assentamento', imagemUrl: require('../../assets/images/vereadores/ALMIR DO ASSENTAMENTO.png') },
    { id: 'm2', nome: 'Angela do Bandeirantes', imagemUrl: require('../../assets/images/vereadores/ANGELA DO BANDEIRANTES.png') },
    { id: 'm3', nome: 'Cacau Motorista', imagemUrl: require('../../assets/images/vereadores/CACAU MOTORISTA.png') },
    { id: 'm4', nome: 'Climério', imagemUrl: require('../../assets/images/vereadores/CLIMERIO.png') },
    { id: 'm5', nome: 'Paulinho do Cuiabá', imagemUrl: require('../../assets/images/vereadores/PAULINHO DO CUIABA.png') },
    { id: 'm6', nome: 'Ramiro Junior', imagemUrl: require('../../assets/images/vereadores/RAMIRO JUNIOR.png') },
    { id: 'm7', nome: 'Sandrinha Jamil', imagemUrl: require('../../assets/images/vereadores/SANDRINHA JAMIL.png') },
    { id: 'm8', nome: 'Vinicíus Donato', imagemUrl: require('../../assets/images/vereadores/VINICIUS PROFESSOR DONATO.png') },
    { id: 'm9', nome: 'Zé Cotó', imagemUrl: require('../../assets/images/vereadores/ZE COTO.png') },
  ];

  const navegarParaEnviarOcorrencia = (vereador: Vereador) => {
    router.push({
      pathname: '/enviar-ocorrencia',
      params: {
        vereadorId: vereador.id,
        vereadorNome: vereador.nome,
      },
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mirante.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Escolher Vereador' }} />
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Para quem gostaria de enviar?</Text>
          <Text style={styles.headerSubtitle}>Escolha o vereador para enviar a ocorrência.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.vereadoresContainer}>
            {vereadores.map((vereador) => (
              <TouchableOpacity
                key={vereador.id}
                style={styles.vereadorCard}
                onPress={() => navegarParaEnviarOcorrencia(vereador)}
              >
                <Image
                  source={vereador.imagemUrl}
                  style={styles.vereadorImagem}
                  resizeMode="cover"
                />
                <Text style={styles.vereadorNome}>{vereador.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.voltarButton} onPress={() => router.back()}>
          <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
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
    backgroundColor:  'rgba(255, 255, 255, 0.45)', // Semi-transparente para melhor visibilidade do conteúdo
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e2356',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  vereadoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  vereadorCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vereadorImagem: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    marginBottom: 5,
  },
  vereadorNome: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    paddingVertical: 5,
  },
  voltarButton: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    margin: 15,
  },
  voltarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
