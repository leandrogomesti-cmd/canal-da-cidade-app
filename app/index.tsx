import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { supabase } from '../lib/supabase'; // Importe o cliente Supabase

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Verificar se o usuário deve permanecer logado ao carregar o componente
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      setIsCheckingSession(true);
      
      // Verificar preferência de manter logado primeiro
      const shouldKeepLoggedIn = await AsyncStorage.getItem('keepLoggedIn');
      console.log('Keep logged in preference:', shouldKeepLoggedIn);
      
      // Se o usuário não escolheu manter logado, não fazer nada
      if (shouldKeepLoggedIn !== 'true') {
        setIsCheckingSession(false);
        return;
      }

      // Verificar se há uma sessão ativa no Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        // Se houver erro, limpar a preferência
        await AsyncStorage.removeItem('keepLoggedIn');
        setIsCheckingSession(false);
        return;
      }

      console.log('Sessão encontrada:', !!session);
      console.log('User data:', session?.user?.email);

      if (session && session.user) {
        // Verificar se a sessão ainda é válida (não expirou)
        const now = Math.round(Date.now() / 1000);
        const expiresAt = session.expires_at || 0;
        
        console.log('Session expires at:', new Date(expiresAt * 1000));
        console.log('Current time:', new Date(now * 1000));
        console.log('Session is valid:', expiresAt > now);
        
        if (expiresAt > now) {
          // Sessão válida, navegar para home
          console.log('Redirecionando para home...');
          router.replace('/home');
        } else {
          // Sessão expirada, limpar dados
          console.log('Sessão expirada, fazendo logout...');
          await handleSessionExpired();
        }
      } else {
        // Não há sessão, limpar preferência
        await AsyncStorage.removeItem('keepLoggedIn');
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Função para lidar com sessão expirada
  const handleSessionExpired = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('keepLoggedIn');
    } catch (error) {
      console.error('Erro ao limpar sessão expirada:', error);
    }
  };

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

      if (data?.user && data?.session) {
        console.log('Login realizado com sucesso');
        console.log('User:', data.user.email);
        console.log('Session expires at:', new Date((data.session.expires_at || 0) * 1000));
        
        // Salvar preferência de manter logado APENAS se o checkbox estiver marcado
        try {
          if (keepLoggedIn) {
            await AsyncStorage.setItem('keepLoggedIn', 'true');
            console.log('Usuário será mantido logado');
          } else {
            await AsyncStorage.removeItem('keepLoggedIn');
            console.log('Usuário NÃO será mantido logado');
          }
        } catch (storageError) {
          console.error('Erro ao salvar preferência:', storageError);
        }
        
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

  // Mostrar loading enquanto verifica a sessão
  if (isCheckingSession) {
    return (
      <ImageBackground 
        source={require('@/assets/images/mirante.png')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00A3D9" />
            <Text style={styles.loadingText}>Verificando sessão...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('@/assets/images/mirante.png')}
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
              O aplicativo de conexão direta entre cidadão e câmara municipal.
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="**********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setKeepLoggedIn(!keepLoggedIn)}
              disabled={loading}
            >
              <View style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]}>
                {keepLoggedIn && <Text style={styles.checkboxIcon}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Manter-me conectado</Text>
            </TouchableOpacity>

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

            <Image
              source={require('@/assets/images/zion_logo.png')}
              style={styles.zionLogo}
              resizeMode="contain"
            />
          </View>
        </KeyboardAvoidingView>

        {/* Overlay de loading */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00A3D9" />
          </View>
        )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.66)', // Semi-transparente para melhor visibilidade do conteúdo
  },
  keyboardView: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    fontSize: 18,
    color: '#666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00A3D9',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#00A3D9',
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
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
  zionLogo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00A3D9',
  },
});