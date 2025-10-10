import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground, ScrollView, Alert, Modal } from 'react-native';
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleRegister = async () => {
    // Validando se todos os campos estão preenchidos
    if (!email || !senha || !nome || !cpf || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    // Validando se os termos foram aceitos
    if (!termsAccepted) {
      Alert.alert('Erro', 'Você deve aceitar os Termos de Uso e Política de Privacidade para prosseguir!');
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

  const TermsModal = () => (
    <Modal
      visible={showTermsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Termos de Uso e Política de Privacidade</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowTermsModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.termsTitle}>1. Termos de Uso — Canal da Cidade</Text>
          <Text style={styles.termsSubtitle}>Última atualização: 05/06/2025</Text>
          
          <Text style={styles.termsText}>
            Bem-vindo ao aplicativo Canal da Cidade. Estes Termos de Uso regem a utilização da plataforma, desenvolvida para facilitar o envio de ocorrências da população diretamente aos vereadores da sua cidade.
          </Text>

          <Text style={styles.termsSectionTitle}>1. Aceitação dos Termos</Text>
          <Text style={styles.termsText}>
            Ao se cadastrar e utilizar o app Canal da Cidade, você concorda com os presentes Termos de Uso e com nossa Política de Privacidade. Caso não concorde, não utilize o aplicativo.
          </Text>

          <Text style={styles.termsSectionTitle}>2. Objetivo do Aplicativo</Text>
          <Text style={styles.termsText}>
            O Canal da Cidade é uma ferramenta digital destinada a cidadãos brasileiros para o envio de ocorrências, sugestões e demandas aos vereadores municipais, visando a melhoria contínua da cidade.
          </Text>

          <Text style={styles.termsSectionTitle}>3. Cadastro do Usuário</Text>
          <Text style={styles.termsText}>
            Para utilizar o app, você deverá fornecer:{'\n'}
            • Nome completo{'\n'}
            • CPF (Cadastro de Pessoa Física){'\n'}
            • Endereço de e-mail{'\n'}
            • Senha de acesso{'\n\n'}
            Você se compromete a fornecer informações verdadeiras e atualizadas, sendo responsável pela veracidade dos dados.
          </Text>

          <Text style={styles.termsSectionTitle}>4. Uso do Aplicativo</Text>
          <Text style={styles.termsText}>
            O usuário se compromete a:{'\n'}
            • Utilizar o app de forma ética e legal;{'\n'}
            • Não enviar informações falsas, ofensivas, discriminatórias ou fraudulentas;{'\n'}
            • Não utilizar o app para fins ilícitos ou políticos que não estejam relacionados ao objetivo da plataforma.
          </Text>

          <Text style={styles.termsSectionTitle}>5. Responsabilidades</Text>
          <Text style={styles.termsText}>
            O Canal da Cidade não se responsabiliza por:{'\n'}
            • Respostas (ou falta delas) por parte dos vereadores;{'\n'}
            • Informações falsas enviadas por usuários;{'\n'}
            • Ações tomadas com base nos relatos recebidos, pois o app atua apenas como intermediador.
          </Text>

          <Text style={styles.termsSectionTitle}>6. Suspensão e Cancelamento</Text>
          <Text style={styles.termsText}>
            Reservamo-nos o direito de suspender ou excluir contas que:{'\n'}
            • Violarem estes Termos;{'\n'}
            • Apresentarem comportamento abusivo;{'\n'}
            • Enviarem informações falsas ou caluniosas.
          </Text>

          <Text style={styles.termsSectionTitle}>7. Propriedade Intelectual</Text>
          <Text style={styles.termsText}>
            Todo o conteúdo do aplicativo, incluindo logotipos, textos, códigos e imagens, é de propriedade da empresa desenvolvedora e protegido pelas leis de direitos autorais.
          </Text>

          <Text style={styles.termsSectionTitle}>8. Alterações dos Termos</Text>
          <Text style={styles.termsText}>
            Estes Termos podem ser atualizados periodicamente. Recomendamos que você os revise com frequência. Mudanças relevantes serão notificadas dentro do próprio app.
          </Text>

          <Text style={styles.termsSectionTitle}>9. Foro</Text>
          <Text style={styles.termsText}>
            Fica eleito o foro da comarca da cidade correspondente ao app para dirimir quaisquer controvérsias decorrentes deste contrato.
          </Text>

          <Text style={styles.termsTitle}>2. Política de Privacidade — Canal da Cidade</Text>
          <Text style={styles.termsSubtitle}>Última atualização: 05/06/2025</Text>
          
          <Text style={styles.termsText}>
            Esta Política de Privacidade explica como o aplicativo Canal da Cidade coleta, armazena, utiliza e protege as informações dos usuários. O Canal da Cidade está comprometido com a transparência e segurança dos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </Text>

          <Text style={styles.termsSectionTitle}>1. Dados que Coletamos</Text>
          <Text style={styles.termsText}>
            Durante o cadastro e uso do aplicativo, coletamos os seguintes dados:{'\n'}
            • Nome completo{'\n'}
            • CPF{'\n'}
            • E-mail{'\n'}
            • Senha (criptografada){'\n\n'}
            Também armazenamos as ocorrências enviadas por você, incluindo descrições e dados de localização, se fornecidos.
          </Text>

          <Text style={styles.termsSectionTitle}>2. Finalidade dos Dados</Text>
          <Text style={styles.termsText}>
            Os dados são utilizados para:{'\n'}
            • Identificar e autenticar o usuário;{'\n'}
            • Encaminhar as ocorrências aos vereadores da cidade correspondente;{'\n'}
            • Garantir a segurança e integridade da plataforma;{'\n'}
            • Melhorar a experiência do usuário.
          </Text>

          <Text style={styles.termsSectionTitle}>3. Armazenamento e Segurança</Text>
          <Text style={styles.termsText}>
            Todos os dados são armazenados de forma segura na plataforma Supabase, que utiliza criptografia e práticas de segurança modernas. A senha é armazenada de forma criptografada.
          </Text>

          <Text style={styles.termsSectionTitle}>4. Compartilhamento de Dados</Text>
          <Text style={styles.termsText}>
            Não compartilhamos seus dados pessoais com terceiros, exceto:{'\n'}
            • Quando necessário para o envio das ocorrências aos vereadores;{'\n'}
            • Quando exigido por lei ou ordem judicial.{'\n\n'}
            Jamais venderemos seus dados a anunciantes ou terceiros.
          </Text>

          <Text style={styles.termsSectionTitle}>5. Seus Direitos</Text>
          <Text style={styles.termsText}>
            Você tem o direito de:{'\n'}
            • Acessar seus dados;{'\n'}
            • Corrigir dados incorretos;{'\n'}
            • Solicitar a exclusão de sua conta e dados;{'\n'}
            • Revogar consentimentos fornecidos.{'\n\n'}
            Para exercer esses direitos, entre em contato conosco por meio do suporte no próprio aplicativo.
          </Text>

          <Text style={styles.termsSectionTitle}>6. Consentimento</Text>
          <Text style={styles.termsText}>
            Ao se cadastrar no Canal da Cidade, você consente com esta Política de Privacidade. O consentimento pode ser revogado a qualquer momento, mediante solicitação de exclusão da conta.
          </Text>

          <Text style={styles.termsSectionTitle}>7. Retenção dos Dados</Text>
          <Text style={styles.termsText}>
            Seus dados serão mantidos enquanto sua conta estiver ativa. Caso deseje excluí-la, os dados serão removidos permanentemente, exceto quando houver obrigações legais para retenção.
          </Text>

          <Text style={styles.termsSectionTitle}>8. Alterações na Política</Text>
          <Text style={styles.termsText}>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos os usuários sobre mudanças relevantes através do aplicativo.
          </Text>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => {
              setTermsAccepted(true);
              setShowTermsModal(false);
            }}
          >
            <Text style={styles.acceptButtonText}>Aceitar e Fechar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

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

              <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
                disabled={loading}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Text style={styles.checkboxIcon}>✓</Text>}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsCheckboxText}>
                    Eu aceito os{' '}
                    <Text 
                      style={styles.termsLink}
                      onPress={() => setShowTermsModal(true)}
                    >
                      Termos de Uso e Política de Privacidade
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>

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
        
        <TermsModal />
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00A3D9',
    borderRadius: 3,
    marginRight: 10,
    marginTop: 2,
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
  termsTextContainer: {
    flex: 1,
  },
  termsCheckboxText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  termsLink: {
    color: '#00A3D9',
    textDecorationLine: 'underline',
    fontWeight: '500',
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
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A3D9',
    marginBottom: 10,
  },
  termsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  termsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'justify',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  acceptButton: {
    backgroundColor: '#00A3D9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});