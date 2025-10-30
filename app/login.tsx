import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth, useAlert } from '@/template';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { sendOTP, verifyOTPAndLogin, signInWithPassword, operationLoading } = useAuth();
  const { showAlert } = useAlert();

  const handleSendOTP = async () => {
    if (!email || !password || (mode === 'register' && password !== confirmPassword)) {
      showAlert('Erro', mode === 'register' 
        ? 'Preencha todos os campos e certifique-se de que as senhas coincidem'
        : 'Preencha o email e senha');
      return;
    }

    const { error } = await sendOTP(email);
    if (error) {
      showAlert('Erro', error);
      return;
    }

    setOtpSent(true);
    showAlert('Sucesso', 'Código OTP enviado para seu email');
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      showAlert('Erro', 'Digite o código OTP');
      return;
    }

    const { error } = await verifyOTPAndLogin(email, otp, { password });
    if (error) {
      showAlert('Erro', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Erro', 'Preencha email e senha');
      return;
    }

    const { error } = await signInWithPassword(email, password);
    if (error) {
      showAlert('Erro', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>FoundryERP</Text>
          <Text style={styles.subtitle}>Sistema de Gestão Industrial</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => {
                setMode('login');
                setOtpSent(false);
                setOtp('');
              }}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => {
                setMode('register');
                setOtpSent(false);
                setOtp('');
              }}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                Cadastro
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'login' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.text.disabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={colors.text.disabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.button, operationLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!otpSent ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.text.disabled}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={colors.text.disabled}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    placeholderTextColor={colors.text.disabled}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={[styles.button, operationLoading && styles.buttonDisabled]}
                    onPress={handleSendOTP}
                    disabled={operationLoading}
                  >
                    {operationLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Enviar Código OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.otpInfo}>
                    Código OTP enviado para {email}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Código OTP"
                    placeholderTextColor={colors.text.disabled}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    style={[styles.button, operationLoading && styles.buttonDisabled]}
                    onPress={handleVerifyOTP}
                    disabled={operationLoading}
                  >
                    {operationLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Verificar e Cadastrar</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={handleSendOTP}
                    disabled={operationLoading}
                  >
                    <Text style={styles.linkText}>Reenviar código</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[700],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.neutral[100],
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary[700],
  },
  input: {
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary[600],
    fontSize: 14,
  },
  otpInfo: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
});