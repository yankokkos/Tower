# 🐳 Configuração Docker - Resumo Executivo

## 📦 O que foi criado

### Arquivos Docker

1. **Dockerfile.backend** - Container PHP 8.2-FPM para o backend
2. **Dockerfile.frontend** - Container Nginx servindo frontend estático
3. **docker-compose.yml** - Orquestração completa (dev)
4. **docker-compose.prod.yml** - Orquestração para produção
5. **.dockerignore** - Arquivos ignorados no build

### Configurações Nginx

1. **docker/nginx-api.conf** - Configuração do Nginx para API (proxy PHP-FPM)
2. **docker/nginx-frontend.conf** - Configuração do Nginx para frontend

### Scripts e Utilitários

1. **docker/start.sh** - Script de inicialização rápida
2. **docker/init-db.sh** - Script de inicialização do banco
3. **docker/env.example** - Exemplo de variáveis de ambiente
4. **Makefile** - Comandos simplificados

### Documentação

1. **DOCKER.md** - Documentação completa
2. **README-DOCKER.md** - Guia rápido
3. **DOCKER-SETUP.md** - Este arquivo

## 🚀 Como usar

### Opção 1: Makefile (Recomendado)

```bash
# Configurar ambiente
cp docker/env.example .env
# Editar .env com suas configurações

# Iniciar tudo
make start

# Ver logs
make logs

# Parar
make down
```

### Opção 2: Docker Compose

```bash
# Configurar ambiente
cp docker/env.example .env

# Build e iniciar
docker-compose up -d --build

# Inicializar banco
make init-db

# Ver logs
docker-compose logs -f
```

### Opção 3: Script Shell

```bash
chmod +x docker/start.sh
./docker/start.sh
```

## 📋 Estrutura de Serviços

```
┌─────────────┐
│  Frontend   │ → http://localhost:3000
│   (Nginx)   │
└──────┬──────┘
       │
       ├─→ /api → ┌─────────────┐
       │          │  Nginx API  │ → http://localhost:8080
       │          └──────┬──────┘
       │                 │
       │                 └─→ ┌─────────────┐
       │                      │   Backend   │
       │                      │ (PHP-FPM)   │
       │                      └──────┬──────┘
       │                             │
       └─────────────────────────────┼─→ ┌─────────────┐
                                      │   │    MySQL    │
                                      └──→│   (Port 3306)│
                                          └─────────────┘
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` baseado em `docker/env.example`:

```env
# Banco de Dados
MYSQL_ROOT_PASSWORD=sua_senha_root
DB_NAME=tower_rpg
DB_USER=tower_user
DB_PASS=sua_senha_db
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRATION=86400

# Portas
API_PORT=8080
FRONTEND_PORT=3000
```

## ✅ Checklist de Deploy

### Desenvolvimento

- [x] Docker e Docker Compose instalados
- [ ] Arquivo `.env` configurado
- [ ] Containers buildados e iniciados
- [ ] Banco de dados inicializado
- [ ] Frontend acessível em http://localhost:3000
- [ ] API acessível em http://localhost:8080/api

### Produção

- [ ] Todas as senhas alteradas
- [ ] `JWT_SECRET` forte configurado
- [ ] `API_DEBUG=false` em produção
- [ ] HTTPS configurado (certificado SSL)
- [ ] Firewall configurado
- [ ] Backups automáticos do banco
- [ ] Monitoramento configurado

## 🆘 Troubleshooting Rápido

### Container não inicia
```bash
docker-compose logs [nome-do-servico]
docker-compose ps
```

### Erro de conexão com banco
```bash
docker-compose logs db
docker exec -it tower-mysql mysql -u root -p
```

### Frontend não carrega
```bash
docker-compose logs frontend
docker exec -it tower-frontend ls -la /usr/share/nginx/html
```

### API retorna 502
```bash
docker-compose logs backend
docker-compose logs nginx-api
```

## 📚 Mais Informações

- **Documentação completa**: Veja `DOCKER.md`
- **Guia rápido**: Veja `README-DOCKER.md`
- **Comandos Make**: Execute `make help`

## 🎯 Próximos Passos

1. Configure o arquivo `.env`
2. Execute `make start` ou `docker-compose up -d --build`
3. Inicialize o banco com `make init-db`
4. Acesse http://localhost:3000

---

**Pronto para deploy! 🚀**

