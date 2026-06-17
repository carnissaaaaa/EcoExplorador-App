import axios from 'axios';
import { Platform } from 'react-native';

// IP local da máquina onde o backend Django está rodando (usado apenas em dispositivos móveis/emuladores).
// DICA: Execute 'ipconfig' (Windows) no terminal para achar seu IP local.
export const API_IP = '192.168.2.101'; 
export const API_PORT = '8000';

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    // No navegador, o localhost funciona perfeitamente para acessar o backend na mesma máquina
    return `http://localhost:${API_PORT}`;
  }
  // Em celulares físicos/emuladores, precisamos do IP real da máquina na rede
  return `http://${API_IP}:${API_PORT}`;
};

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});
