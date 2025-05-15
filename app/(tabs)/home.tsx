import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navegarParaVereadores = () => {
    router.push("/vereadores");
  };

  const navegarParaVerOcorrencias = () => {
    router.push("/(tabs)/ver-ocorrencias");
  };

  const navegarParaMarketplace = () => {
    router.push("/(tabs)/marketplace");
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/salto.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo_canal.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            
            <Text style={styles.subtitle}>
              O aplicativo de conexão direta entre cidadão e prefeitura.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaVereadores}
            >
              <Text style={styles.buttonText}>Enviar ocorrência</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaVerOcorrencias}
            >
              <Text style={styles.buttonText}>Ver ocorrências enviadas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaMarketplace}
            >
              <Text style={styles.buttonText}>Marketplace da Cidade</Text>
            </TouchableOpacity>
          </View>

          {/* Novo logo da Zion no rodapé */}
          <View style={styles.zionLogoContainer}>
            <Image
              source={require('@/assets/images/zion_logo.png')}
              style={styles.zionLogo}
              resizeMode="contain"
            />
          </View>
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
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  zionLogoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  zionLogo: {
    width: 320,
    height: 80,
  },
});
