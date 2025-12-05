# ✅ Configuração Docker Completa - Tower RPG

## 📦 Arquivos Criados

### Dockerfiles
- ✅ **Dockerfile.production** - Dockerfile otimizado para produção (Hostinger Cloudify)
- ✅ **Dockerfile** - Dockerfile padrão (desenvolvimento)

### Configuração Docker
- ✅ **docker-compose.yml** - Orquestração completa (app + MySQL opcional)
- ✅ **cloudify.yml** - Configuração específica para Cloudify
- ✅ **.dockerignore** - Arquivos ignorados no build

### Documentação
- ✅ **DEPLOY-HOSTINGER.md** - Guia completo de deploy na Hostinger
- ✅ **DOCKER-QUICK-START.md** - Guia rápido de deploy
- ✅ **README-DOCKER.md** - Documentação completa do Docker

### Arquivos Auxiliares
- ✅ **backend/public/.htaccess** - Configuração Apache para Slim Framework
- ✅ **.gitignore** - Atualizado para ignorar arquivos Docker

## 🚀 Como Usar

### Deploy na Hostinger Cloudify

1. **Acesse o painel Cloudify**
2. **Crie nova aplicação** → Deploy from Git
3. **Configure:**
   - Repositório: `https://github.com/yankokkos/Tower.git`
   - Dockerfile: `Dockerfile.production`
   - Porta: `80`
4. **Adicione variáveis de ambiente** (veja DOCKER-QUICK-START.md)
5. **Deploy!**

### Teste Local (Opcional)

```bash
# Build
docker build -f Dockerfile.production -t tower-rpg:latest .

# Executar
docker run -d -p 80:80 \
  -e DB_HOST=193.203.175.91 \
  -e DB_NAME=u737502399_Tower \
  -e DB_USER=u737502399_Tower \
  -e DB_PASS=Tower@kokkos03 \
  -e JWT_SECRET=test_secret \
  --name tower-rpg-app \
  tower-rpg:latest
```

## 📋 Arquitetura

```
Container Docker
├── Nginx (Porta 80)
│   ├── Frontend React (build estático)
│   └── Proxy /api → Apache:8080
└── Apache (Porta 8080)
    └── Backend PHP/Slim (API REST)
```

## ⚙️ Variáveis de Ambiente Necessárias

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

## 📚 Próximos Passos

1. ✅ **Commit e Push** dos arquivos Docker para o repositório Git
2. ✅ **Configurar no Cloudify** seguindo DOCKER-QUICK-START.md
3. ✅ **Fazer deploy** e testar
4. ✅ **Verificar banco de dados** (tabelas devem estar criadas)

## 🔍 Verificação

Após o deploy, teste:

1. **Frontend:** Acesse a URL fornecida pela Hostinger
2. **Login:** Use `player1@tower.com` / `player123`
3. **API:** Teste `https://seu-dominio.com/api/v1/reference-data/planes`

## 📖 Documentação Completa

- **Deploy rápido:** [DOCKER-QUICK-START.md](./DOCKER-QUICK-START.md)
- **Deploy detalhado:** [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md)
- **Docker completo:** [README-DOCKER.md](./README-DOCKER.md)

## ⚠️ Importante

- Altere o `JWT_SECRET` em produção!
- Configure `CORS_ALLOWED_ORIGINS` com seu domínio real
- Certifique-se de que as tabelas do banco estão criadas

## 🎉 Pronto para Deploy!

Tudo configurado e pronto para deploy na Hostinger Cloudify! 🚀

