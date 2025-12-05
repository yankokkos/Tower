# Solução para Erro "invalid tag Dockerfile" no Coolify

## Problema

O erro `invalid tag "Dockerfile:commit-sha": repository name must be lowercase` ocorre porque o Coolify está tentando usar "Dockerfile" como nome da imagem Docker.

## Soluções

### Solução 1: Usar Build Pack Node.js (Recomendado)

No painel do Coolify:

1. Vá em **Settings** da aplicação
2. Em **Build Pack**, selecione **Node.js** (não Docker)
3. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && node dist/index.js`
   - **Working Directory**: `backend`
   - **Port**: `5001`

### Solução 2: Configurar Nome da Imagem no Coolify

Se quiser usar Docker:

1. No painel do Coolify, vá em **Settings** da aplicação
2. Em **Docker Settings**, configure:
   - **Dockerfile Path**: `Dockerfile` (ou deixe em branco)
   - **Build Context**: `.` (raiz)
   - **Image Name**: `tower-rpg-backend` (ou qualquer nome em minúsculas)
3. Certifique-se de que o nome da imagem está em **minúsculas** e sem espaços

### Solução 3: Renomear Dockerfile (Alternativa)

Se as soluções acima não funcionarem:

1. No Coolify, configure **Dockerfile Path** como: `./Dockerfile`
2. Ou use **Build Context**: `backend` e **Dockerfile Path**: `Dockerfile`

## Configuração Recomendada (Build Pack Node.js)

```
Build Pack: Node.js
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && node dist/index.js
Working Directory: backend
Port: 5001
Node Version: 18 (ou superior)
```

## Variáveis de Ambiente

Configure estas variáveis no Coolify:

```env
DB_HOST=193.203.175.91
DB_NAME=u737502399_Tower
DB_USER=u737502399_Tower
DB_PASS=Tower@kokkos03
DB_PORT=3306
JWT_SECRET=TowerRPG_2024_Secure_Key_Change_In_Production_If_Needed
JWT_EXPIRATION=86400
API_ENV=production
API_DEBUG=false
PORT=5001
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
```

## Teste

Após o deploy, teste o health check:

```bash
curl http://seu-servidor:5001/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "database": "connected"
}
```

