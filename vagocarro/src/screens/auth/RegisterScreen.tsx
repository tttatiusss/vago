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

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const insets = useSafeAreaInsets();
  const { register, isLoading, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errors: { fullName?: string; email?: string; password?: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'O nome completo é obrigatório.';
    } else if (fullName.trim().split(' ').length < 2) {
      errors.fullName = 'Por favor, insira nome e sobrenome.';
    }

    if (!email.trim()) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Insira um e-mail válido.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;
    await register(fullName.trim(), email.trim(), password);
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
            {/* Top Navigation */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={onNavigateToLogin}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
              <View style={styles.badgeContainer}>
                <Ionicons name="car-sport" size={18} color="#000000" />
                <Text style={styles.badgeText}>Novo Motorista</Text>
              </View>
            </View>

            {/* Title matching uploaded design */}
            <Text style={styles.title}>Crie sua conta de motorista</Text>

            {/* Error banner if general error */}
            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#E11900" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <CustomInput
                label="Nome completo"
                placeholder="Ex: Carlos Silva"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                autoCapitalize="words"
                returnKeyType="next"
                error={fieldErrors.fullName}
              />

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
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                error={fieldErrors.password}
              />

              <Text style={styles.termsText}>
                Ao continuar, você concorda com os Termos de Serviço e a Política de Privacidade para motoristas parceiros.
              </Text>
            </View>

            {/* Bottom Actions */}
            <View style={styles.footerContainer}>
              <PrimaryButton
                title="Criar conta e continuar"
                onPress={handleRegister}
                isLoading={isLoading}
              />

              <View style={styles.switchAuthRow}>
                <Text style={styles.switchAuthText}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
                  <Text style={styles.switchAuthLink}>Entrar</Text>
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
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
    marginBottom: 24,
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
  termsText: {
    fontSize: 12,
    color: '#767676',
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 16,
  },
  footerContainer: {
    width: '100%',
    marginTop: 24,
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
