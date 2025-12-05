# Quick Start - Docker para Hostinger Cloudify

## ⚡ Deploy Rápido

### 1. Configurar no Cloudify

1. Acesse o painel Cloudify da Hostinger
2. **Nova Aplicação** → **Deploy from Git**
3. Repositório: `https://github.com/yankokkos/Tower.git`
4. Branch: `main` (ou `master`)

### 2. Configurações de Build

- **Dockerfile:** `Dockerfile.production`
- **Build Context:** `.` (ponto)
- **Porta:** `80`

### 3. Variáveis de Ambiente

Cole estas variáveis no painel Cloudify:

```env
DB_HOST=193.203.175.91
DB_NAME=u737502399_Tower
DB_USER=u737502399_Tower
DB_PASS=Tower@kokkos03
DB_PORT=3306
JWT_SECRET=TowerRPG_2024_Secure_Key_Change_In_Production
JWT_EXPIRATION=86400
API_ENV=production
API_DEBUG=false
CORS_ALLOWED_ORIGINS=*
```

### 4. Deploy

Clique em **Deploy** e aguarde (5-10 minutos na primeira vez).

### 5. Verificar

Acesse a URL fornecida pela Hostinger e teste o login:
- Email: `player1@tower.com`
- Senha: `player123`

## ✅ Pronto!

Sua aplicação está no ar! 🚀

Para mais detalhes, veja [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md)

