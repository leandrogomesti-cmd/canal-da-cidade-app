import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface Vereador {
  id: string;
  nome: string;
  imagemUrl: any;
}

export default function VereadoresScreen() {
  const vereadores: Vereador[] = [
    { id: '1', nome: 'Almir de Melo', imagemUrl: require('../../assets/images/vereadores/almir.jpg') },
    { id: '2', nome: 'Antonio Moreira', imagemUrl: require('../../assets/images/vereadores/antonio.jpg') },
    { id: '3', nome: 'Arildo Guadagnini', imagemUrl: require('../../assets/images/vereadores/arildo.jpg') },
    { id: '4', nome: 'Clayton Aparecido', imagemUrl: require('../../assets/images/vereadores/clayton.jpg') },
    { id: '5', nome: 'Edemilson Pereira', imagemUrl: require('../../assets/images/vereadores/edemilson.jpg') },
    { id: '6', nome: 'Edival Pereira', imagemUrl: require('../../assets/images/vereadores/edival.jpg') },
    { id: '7', nome: 'Graziela Costa', imagemUrl: require('../../assets/images/vereadores/graziela.jpg') },
    { id: '8', nome: 'Henrique Balseiros', imagemUrl: require('../../assets/images/vereadores/henrique.jpg') },
    { id: '9', nome: 'Luzia de Fátima', imagemUrl: require('../../assets/images/vereadores/luzia.jpg') },
    { id: '10', nome: 'Michel Oliveira', imagemUrl: require('../../assets/images/vereadores/michel.jpg') },
    { id: '11', nome: 'Rogério dos Santos', imagemUrl: require('../../assets/images/vereadores/rogerio.jpg') },
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
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
    height: 200,
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
    backgroundColor: '#aaa',
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