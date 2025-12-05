# Tower RPG Backend API

Backend Node.js com Express + TypeScript para o sistema Tower RPG.

## Tecnologias

- **Node.js** 18+
- **Express** 4.x
- **TypeScript** 5.x
- **MySQL2** (conexão com MySQL remoto)
- **JWT** (autenticação)
- **bcryptjs** (hash de senhas)
- **Zod** (validação)

## Estrutura

```
backend/
├── src/
│   ├── config/          # Configurações (database, env)
│   ├── controllers/     # Controllers da API
│   ├── middleware/       # Middlewares (CORS, auth, error)
│   ├── models/          # Models de dados
│   ├── routes/          # Rotas da API
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários
│   └── index.ts         # Entry point
├── Dockerfile           # Docker para produção
├── package.json
└── tsconfig.json
```

## Instalação

```bash
cd backend
npm install
```

## Configuração

Copie o arquivo `config.env` do root do projeto para a raiz do backend (ou configure variáveis de ambiente):

```env
DB_HOST=193.203.175.91
DB_NAME=u737502399_Tower
DB_USER=u737502399_Tower
DB_PASS=Tower@kokkos03
DB_PORT=3306

JWT_SECRET=TowerRPG_2024_Secure_Key_Change_In_Production_If_Needed
JWT_EXPIRATION=86400

API_ENV=development
API_DEBUG=true
PORT=5001

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Desenvolvimento

```bash
npm run dev
```

O servidor irá iniciar em `http://localhost:5001` com hot-reload.

## Build

```bash
npm run build
```

Compila TypeScript para JavaScript na pasta `dist/`.

## Produção

```bash
npm start
```

## Endpoints

### Autenticação
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Login

### Campanhas
- `GET /api/v1/campaigns` - Listar campanhas
- `GET /api/v1/campaigns/:id` - Obter campanha
- `POST /api/v1/campaigns` - Criar campanha
- `PUT /api/v1/campaigns/:id` - Atualizar campanha
- `DELETE /api/v1/campaigns/:id` - Deletar campanha

### Personagens
- `GET /api/v1/characters` - Listar personagens
- `GET /api/v1/characters/:id` - Obter personagem
- `POST /api/v1/characters` - Criar personagem
- `PUT /api/v1/characters/:id` - Atualizar personagem
- `DELETE /api/v1/characters/:id` - Deletar personagem

### NPCs
- `GET /api/v1/npcs?campaign_id=xxx` - Listar NPCs
- `GET /api/v1/npcs/:id` - Obter NPC
- `POST /api/v1/npcs` - Criar NPC
- `PUT /api/v1/npcs/:id` - Atualizar NPC

### Ameaças
- `GET /api/v1/threats?campaign_id=xxx` - Listar ameaças
- `GET /api/v1/threats/:id` - Obter ameaça
- `POST /api/v1/threats` - Criar ameaça
- `PUT /api/v1/threats/:id` - Atualizar ameaça

### Relatórios
- `GET /api/v1/reports?campaign_id=xxx` - Listar relatórios
- `GET /api/v1/reports/:id` - Obter relatório
- `POST /api/v1/reports` - Criar relatório
- `PUT /api/v1/reports/:id` - Atualizar relatório

### Convocações
- `GET /api/v1/summons?campaign_id=xxx` - Listar convocações
- `GET /api/v1/summons/:id` - Obter convocação
- `POST /api/v1/summons` - Criar convocação
- `PUT /api/v1/summons/:id` - Atualizar convocação
- `POST /api/v1/summons/:id/confirm` - Confirmar convocação
- `POST /api/v1/summons/:id/decline` - Recusar convocação

### Documentos
- `GET /api/v1/documents?campaign_id=xxx` - Listar documentos
- `GET /api/v1/documents/:id` - Obter documento
- `POST /api/v1/documents` - Criar documento
- `PUT /api/v1/documents/:id` - Atualizar documento

### Dados de Referência (sem autenticação)
- `GET /api/v1/reference/planes` - Listar planos
- `GET /api/v1/reference/equipment` - Listar equipamentos
- `GET /api/v1/reference/advantages` - Listar vantagens
- `GET /api/v1/reference/disadvantages` - Listar desvantagens

### Health Check
- `GET /health` - Status da API e conexão com banco

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Envie o token no header:

```
Authorization: Bearer <token>
```

## Docker

Para build da imagem Docker:

```bash
docker build -t tower-rpg-backend .
```

Para executar:

```bash
docker run -p 5001:5001 --env-file .env tower-rpg-backend
```

## Deploy no Coolify

Veja `DEPLOY-COOLIFY.md` na raiz do projeto para instruções completas de deploy no Coolify.

