import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/common/CustomInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Insira um e-mail válido.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;
    await login(email.trim(), password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Navigation / Brand */}
            <View style={styles.headerRow}>
              <View style={styles.badgeContainer}>
                <Ionicons name="car-sport" size={20} color="#000000" />
                <Text style={styles.badgeText}>Vago Motorista</Text>
              </View>
            </View>

            {/* Title matching the uploaded design */}
            <Text style={styles.title}>Qual é o seu e-mail?</Text>

            {/* Error banner if general error */}
            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#E11900" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Inputs Section */}
            <View style={styles.formContainer}>
              <CustomInput
                label="Email"
                placeholder="name@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                error={fieldErrors.email}
              />

              <CustomInput
                label="Senha"
                placeholder="Insira sua senha"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                error={fieldErrors.password}
              />

              <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Actions */}
            <View style={styles.footerContainer}>
              <PrimaryButton
                title="Continuar"
                onPress={handleLogin}
                isLoading={isLoading}
              />

              <View style={styles.switchAuthRow}>
                <Text style={styles.switchAuthText}>Não tem uma conta?</Text>
                <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
                  <Text style={styles.switchAuthLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 28,
    lineHeight: 34,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorBannerText: {
    color: '#E11900',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginTop: -8,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#545454',
  },
  footerContainer: {
    width: '100%',
    marginTop: 32,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  switchAuthText: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  switchAuthLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});
