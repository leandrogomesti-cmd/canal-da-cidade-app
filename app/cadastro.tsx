import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { supabase } from '../lib/supabase';


export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validando se todos os campos estão preenchidos
    if (!email || !senha || !nome || !cpf || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    // Validando se as senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    try {
      setLoading(true);

      // Criando o usuário no Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            cpf,
          }
        }
      });

      if (signUpError) {
        console.error('Erro no signUp:', signUpError.message);
        Alert.alert('Erro', signUpError.message);
        return;
      }

      const userId = signUpData?.user?.id;

      if (userId) {
        // Salvando os dados extras (nome e CPF) na tabela 'usuarios'
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: userId,
              email,
              nome,
              cpf,
            },
          ]);

        if (insertError) {
          console.error('Erro ao salvar dados extras:', insertError.message);
          Alert.alert('Erro', insertError.message);
          return;
        }
      }

      // Sucesso no cadastro
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('/');
    } catch (err) {
      console.error('Erro inesperado:', err);
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
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
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Criar Nova Conta</Text>
              
              <Text style={styles.label}>Nome Completo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />

              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                maxLength={14}
              />

              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Senha:</Text>
              <TextInput
                style={styles.input}
                placeholder="**********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />

              <Text style={styles.label}>Confirmar Senha:</Text>
              <TextInput
                style={styles.input}
                placeholder="**********"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <Link href="/" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Entrar</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00A3D9',
    margin: 0,
    lineHeight: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
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
  button: {
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#333',
    fontSize: 14,
  },
  loginLink: {
    color: '#4A4A9A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
