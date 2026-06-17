import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

// Helper de armazenamento compatível com Web (localStorage) e Mobile (SecureStore)
const tokenStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    try {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        return await SecureStore.getItemAsync(key);
      }
    } catch {
      console.warn("SecureStore não disponível para leitura, usando fallback.");
    }
    return null;
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    try {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.setItemAsync(key, value);
      }
    } catch {
      console.warn("SecureStore não disponível para escrita.");
    }
  },
  
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    try {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch {
      console.warn("SecureStore não disponível para deleção.");
    }
  }
};

interface User {
  id: number;
  username: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (username: string, envSenha: string) => Promise<void>;
  signUp: (username: string, envSenha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar token salvo e validar sessão
    async function loadStoredAuth() {
      try {
        const token = await tokenStorage.getItem('accessToken');
        
        if (token) {
          // Configura o cabeçalho padrão para requisições futuras
          api.defaults.headers.common['Authorization'] = `JWT ${token}`;
          
          // Verifica se o token ainda é válido acessando a rota protegida do perfil
          const response = await api.get('/auth/users/me/');
          setUser(response.data);
        }
      } catch {
        // Se falhar (ex: token expirado), removemos os dados guardados
        await cleanAuthStorage();
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  async function cleanAuthStorage() {
    await tokenStorage.deleteItem('accessToken');
    await tokenStorage.deleteItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  async function signIn(username: string, envSenha: string) {
    try {
      setIsLoading(true);
      // O endpoint de geração do token Simple JWT configurado no Djoser
      const response = await api.post('/auth/jwt/create/', {
        username,
        password: envSenha,
      });

      const { access, refresh } = response.data;

      // Salva os tokens com segurança
      await tokenStorage.setItem('accessToken', access);
      await tokenStorage.setItem('refreshToken', refresh);

      // Adiciona o token no cabeçalho das requisições futuras
      api.defaults.headers.common['Authorization'] = `JWT ${access}`;

      // Busca os dados do usuário autenticado
      const userResponse = await api.get('/auth/users/me/');
      setUser(userResponse.data);
    } catch (error: any) {
      await cleanAuthStorage();
      const message = error.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(username: string, envSenha: string) {
    try {
      setIsLoading(true);
      // Criar usuário no Djoser
      await api.post('/auth/users/', {
        username,
        password: envSenha,
      });
      
      // Após registrar com sucesso, faz o login automaticamente para conveniência
      await signIn(username, envSenha);
    } catch (error: any) {
      // Djoser retorna erros detalhados (ex: se o usuário já existe)
      let errorMessage = 'Erro ao realizar cadastro.';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.username) {
          errorMessage = `Usuário: ${data.username.join(' ')}`;
        } else if (data.password) {
          errorMessage = `Senha: ${data.password.join(' ')}`;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(' ');
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    await cleanAuthStorage();
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
