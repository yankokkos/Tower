# Docker - Tower RPG

Este projeto inclui configuração Docker completa para deploy em produção, especialmente otimizada para Hostinger Cloudify.

## Estrutura Docker

- **Dockerfile.production**: Dockerfile otimizado para produção (recomendado para Hostinger)
- **Dockerfile**: Dockerfile padrão (para desenvolvimento local)
- **docker-compose.yml**: Orquestração completa com MySQL (opcional)
- **cloudify.yml**: Configuração específica para Cloudify

## Build Local

### Build da Imagem

```bash
# Build da imagem de produção
docker build -f Dockerfile.production -t tower-rpg:latest .

# Ou usando docker-compose
docker-compose build
```

### Executar com Docker Compose

```bash
# Iniciar todos os serviços (app + MySQL)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Executar Container Individual

```bash
# Executar container
docker run -d \
  -p 80:80 \
  -e DB_HOST=193.203.175.91 \
  -e DB_NAME=u737502399_Tower \
  -e DB_USER=u737502399_Tower \
  -e DB_PASS=Tower@kokkos03 \
  -e DB_PORT=3306 \
  -e JWT_SECRET=seu_jwt_secret_aqui \
  -e CORS_ALLOWED_ORIGINS=https://seu-dominio.com \
  --name tower-rpg-app \
  tower-rpg:latest
```

## Arquitetura Docker

```
┌─────────────────────────────────────┐
│         Nginx (Porta 80)            │
│  ┌───────────────────────────────┐  │
│  │   Frontend (React Build)      │  │
│  │   - Serve arquivos estáticos  │  │
│  │   - SPA routing               │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Proxy /api → Apache:8080    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Apache (Porta 8080)             │
│  ┌───────────────────────────────┐  │
│  │   Backend PHP/Slim             │  │
│  │   - API REST                   │  │
│  │   - JWT Auth                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      MySQL (Externo ou Container)    │
└─────────────────────────────────────┘
```

## Variáveis de Ambiente

### Obrigatórias

- `DB_HOST`: Host do banco de dados MySQL
- `DB_NAME`: Nome do banco de dados
- `DB_USER`: Usuário do banco de dados
- `DB_PASS`: Senha do banco de dados
- `DB_PORT`: Porta do MySQL (padrão: 3306)
- `JWT_SECRET`: Chave secreta para JWT (mude em produção!)

### Opcionais

- `JWT_EXPIRATION`: Tempo de expiração do token em segundos (padrão: 86400)
- `API_ENV`: Ambiente da API (development/production)
- `API_DEBUG`: Habilitar debug (true/false)
- `CORS_ALLOWED_ORIGINS`: Origens permitidas para CORS (separadas por vírgula)

## Deploy na Hostinger Cloudify

Veja o arquivo [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md) para instruções detalhadas.

### Resumo Rápido

1. Configure o repositório Git no Cloudify: `https://github.com/yankokkos/Tower.git`
2. Selecione `Dockerfile.production` como Dockerfile
3. Configure as variáveis de ambiente no painel Cloudify
4. Faça o deploy

## Troubleshooting

### Container não inicia

```bash
# Ver logs
docker logs tower-rpg-app

# Verificar se os processos estão rodando
docker exec tower-rpg-app ps aux
```

### Erro de conexão com banco

1. Verifique as variáveis de ambiente
2. Teste a conexão do container:
```bash
docker exec tower-rpg-app php -r "echo 'Test';"
```

### Frontend não carrega

1. Verifique se o build foi concluído:
```bash
docker exec tower-rpg-app ls -la /var/www/html/frontend
```

2. Verifique os logs do Nginx:
```bash
docker exec tower-rpg-app tail -f /var/log/nginx/error.log
```

### API não responde

1. Verifique se o Apache está rodando:
```bash
docker exec tower-rpg-app service apache2 status
```

2. Teste a API diretamente:
```bash
docker exec tower-rpg-app curl http://localhost:8080/api/v1/reference-data/planes
```

## Desenvolvimento Local

Para desenvolvimento local, use:

```bash
# Frontend
npm run dev

# Backend (em outro terminal)
cd backend/public
php -S localhost:8000
```

Docker é recomendado apenas para produção/deploy.

## Otimizações

O `Dockerfile.production` inclui:

- ✅ Multi-stage build para reduzir tamanho da imagem
- ✅ Cache de dependências npm e composer
- ✅ Gzip compression no Nginx
- ✅ Headers de segurança
- ✅ Cache de assets estáticos
- ✅ Healthcheck configurado

## Tamanho da Imagem

A imagem final deve ter aproximadamente **500-700 MB** (dependendo das dependências).

Para reduzir ainda mais:

1. Use `alpine` base images (já está usando onde possível)
2. Limpe cache do apt após instalações
3. Remova arquivos desnecessários antes do commit

## Suporte

Para problemas específicos:
- Docker: Consulte a documentação oficial do Docker
- Hostinger: Veja [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md)
- Projeto: Abra uma issue no GitHub

