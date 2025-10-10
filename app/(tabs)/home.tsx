import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ImageBackground, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const navegarParaVereadores = () => {
    router.push("/vereadores");
  };

  const navegarParaVerOcorrencias = () => {
    router.push("/(tabs)/ver-ocorrencias");
  };

  const navegarParaMarketplace = () => {
    router.push("/(tabs)/marketplace");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/');
    } else {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/mirante2.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#ffffffff" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#000" />
                <Text style={styles.menuItemText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo_mirante.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            
            <Text style={styles.subtitle}>
              O aplicativo de conexão direta entre cidadão e vereadores.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaVereadores}
            >
              <Ionicons name="warning" size={28} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Enviar ocorrência</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaVerOcorrencias}
            >
              <Ionicons name="eye" size={28} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Ver ocorrências enviadas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={navegarParaMarketplace}
            >
              <Ionicons name="storefront" size={28} color="#fff" style={styles.buttonIcon} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Semi-transparente para melhor visibilidade do conteúdo
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  profileButton: {
    padding: 5,
    paddingTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 80, // Adjust this value to position the menu below the profile icon
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    marginTop: 60, // to avoid overlap with the header
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 125,
    height: 125
  },
  buttonIcon: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  zionLogoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  zionLogo: {
    width: 820,
    height: 150,
  },
});