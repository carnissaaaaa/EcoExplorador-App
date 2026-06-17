import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Easing,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Definindo a família de fonte ideal com base na plataforma (Web, iOS, Android)
const customFont = Platform.OS === 'web' 
  ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  : (Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium');

export function LoginScreen({ navigation }: any) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState(''); // Representa o campo de usuário (Username)
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para o Modal de erro e info
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(50));
  const [floatAnim1] = useState(() => new Animated.Value(0));
  const [floatAnim2] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();

    const createFloatingAnimation = (anim: Animated.Value, duration: number, offset: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: offset,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      );
    };

    createFloatingAnimation(floatAnim1, 4000, -20).start();
    createFloatingAnimation(floatAnim2, 5000, 30).start();
  }, [fadeAnim, slideAnim, floatAnim1, floatAnim2]);

  const handleAuthAction = async () => {
    if (!email.trim() || !senha) {
      setErrorMessage('Por favor, preencha o usuário e a senha.');
      setErrorVisible(true);
      return;
    }

    if (email.trim().length < 3) {
      setErrorMessage('O usuário deve conter pelo menos 3 caracteres.');
      setErrorVisible(true);
      return;
    }

    // Regras de senha padrão Django (min 8 chars, 1 maiúscula, 1 minúscula, 1 número)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(senha)) {
      setErrorMessage('A senha não atende aos requisitos mínimos de segurança.\n\nClique no botão "?" ao lado do campo "Senha" para ver as regras.');
      setErrorVisible(true);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isRegistering) {
        await signUp(email.trim(), senha);
      } else {
        await signIn(email.trim(), senha);
      }
      // O redirecionamento é feito de forma automática pela re-renderização condicional no App.tsx
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocorreu um erro ao realizar a operação.');
      setErrorVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.circle1, { transform: [{ translateY: floatAnim1 }] }]} />
      <Animated.View style={[styles.circle2, { transform: [{ translateY: floatAnim2 }] }]} />
      
      <Animated.View style={[
        styles.formWrapper, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isRegistering ? 'Criar Conta' : 'EcoExplorador'}
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering ? 'Cadastre-se para iniciar a exploração' : 'Descubra a biodiversidade do Brasil'}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome de usuário"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { marginBottom: 0 }]}>Senha</Text>
              <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.helpButton}>
                <Text style={styles.helpButtonText}>?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Digite sua senha"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={senha}
                onChangeText={setSenha}
                editable={!isSubmitting}
              />
              <TouchableOpacity 
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#94A3B8" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {!isRegistering && (
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setForgotVisible(true)}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, isSubmitting && { opacity: 0.8 }]} 
            onPress={handleAuthAction} 
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? 'Cadastrar e Entrar' : 'Iniciar Exploração'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleRegisterButton} 
            onPress={() => setIsRegistering(!isRegistering)}
            disabled={isSubmitting}
          >
            <Text style={styles.toggleRegisterText}>
              {isRegistering ? 'Já tem uma conta? Fazer Login' : 'Não tem uma conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modal Estilizado de Erro */}
      <Modal
        visible={errorVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setErrorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>!</Text>
            </View>
            <Text style={styles.modalTitle}>Atenção</Text>
            <Text style={styles.modalText}>{errorMessage}</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setErrorVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Informação (Regras de Senha) */}
      <Modal
        visible={infoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
              <Text style={[styles.modalIcon, { color: '#34D399' }]}>?</Text>
            </View>
            <Text style={styles.modalTitle}>Regras da Senha</Text>
            <Text style={[styles.modalText, { textAlign: 'left', lineHeight: 28 }]}>
              • Mínimo de 8 caracteres{'\n'}
              • Pelo menos 1 letra maiúscula{'\n'}
              • Pelo menos 1 letra minúscula{'\n'}
              • Pelo menos 1 número
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: '#10B981', shadowColor: '#10B981' }]} 
              onPress={() => setInfoVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Esqueci a Senha (Em Desenvolvimento) */}
      <Modal
        visible={forgotVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setForgotVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
              <Ionicons name="construct-outline" size={30} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>Em Desenvolvimento</Text>
            <Text style={[styles.modalText, { marginBottom: 25 }]}>
              A funcionalidade de recuperação de senha estará disponível nas próximas atualizações.
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: '#10B981', shadowColor: '#10B981' }]} 
              onPress={() => setForgotVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B130E', // Tom verde-escuro quase preto de alta fidelidade
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    position: 'absolute',
    top: '10%',
    left: '-5%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#059669', // Verde esmeralda escuro
    opacity: 0.15,
  },
  circle2: {
    position: 'absolute',
    bottom: '5%',
    right: '-5%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#10B981', // Verde esmeralda brilhante
    opacity: 0.1,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontFamily: customFont,
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: customFont,
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 35,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  label: {
    fontFamily: customFont,
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  helpButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  helpButtonText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    fontFamily: customFont,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 75,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    zIndex: 2,
  },
  showPasswordText: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -5,
  },
  forgotPasswordText: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#10B981', // Verde principal
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  buttonText: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#111C15', // Card modal escuro com matiz verde
    borderRadius: 28,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalIcon: {
    fontFamily: customFont,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F87171',
  },
  modalTitle: {
    fontFamily: customFont,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalText: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#F87171',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleRegisterButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleRegisterText: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 14,
    fontWeight: '600',
  },
});
