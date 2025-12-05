// Configuração da API
export const API_CONFIG = {
  // URL base da API - ajuste conforme necessário
  // Em desenvolvimento: http://localhost:8000
  // Em produção: URL do servidor onde o backend está hospedado
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // Timeout para requisições (em milissegundos)
  timeout: 30000,
  
  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

