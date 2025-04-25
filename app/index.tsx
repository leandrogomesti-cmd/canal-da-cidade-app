import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase'; // Importe o cliente Supabase

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para lidar com o login
  const handleLogin = async () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      // Autenticação com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        Alert.alert('Erro de Login', error.message);
        return;
      }

      if (data?.user) {
        // Login bem-sucedido, navegar para a home
        router.replace('/home');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
      console.error('Erro de login:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o esquecimento de senha
  const handleForgotPassword = async () => {
    if (email === '') {
      Alert.alert('Erro', 'Por favor, insira seu email para redefinir a senha');
      return;
    }

    try {
      setLoading(true);
      
      // Solicitar redefinição de senha com Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }

      Alert.alert('Sucesso', 'Um link para redefinição de senha foi enviado para seu email');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao solicitar a redefinição de senha');
      console.error('Erro ao redefinir senha:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/salto.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
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

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="**********"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerContainer} disabled={loading}>
              <Link href="/cadastro">
                <Text style={styles.registerText}>Criar uma nova conta</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparente para melhor visibilidade do conteúdo
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00A3D9',
    margin: 0,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
  forgotPassword: {
    color: '#4A4A9A',
    textAlign: 'left',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#7DCAEB', // Versão mais clara do azul quando desabilitado
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    color: '#4A4A9A',
    fontSize: 16,
  },
});