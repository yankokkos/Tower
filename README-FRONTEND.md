# Frontend - Tower RPG

## Configuração da API

O frontend está configurado para usar a API real do backend PHP. 

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_URL=http://localhost:8000
```

Para produção, altere para a URL do seu servidor:

```env
VITE_API_URL=https://seu-servidor.com
```

### Estrutura de Serviços

- `src/services/api.ts` - Serviço de API real que faz chamadas HTTP para o backend
- `src/config/api.ts` - Configuração da URL base e headers
- `src/utils/auth.ts` - Utilitários de autenticação (armazena token JWT)

### Autenticação

O token JWT é automaticamente incluído em todas as requisições autenticadas através do header `Authorization: Bearer {token}`.

### Tratamento de Erros

- Erros 401 (não autorizado) limpam automaticamente a autenticação
- Erros são lançados como `ApiError` com mensagem e status code
- Timeout de 30 segundos para requisições

### Migração de Mock para API Real

Todos os componentes foram atualizados para usar `api` ao invés de `mockApi`:

- ✅ Login e Registro
- ✅ Campanhas
- ✅ Personagens
- ✅ NPCs
- ✅ Ameaças
- ✅ Relatórios
- ✅ Convocações
- ✅ Documentos
- ✅ Eventos

### Desenvolvimento

```bash
# Iniciar frontend
npm run dev

# Iniciar backend (em outro terminal)
cd backend/public
php -S localhost:8000
```

O frontend estará em `http://localhost:5173` e a API em `http://localhost:8000`.

