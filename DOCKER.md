# 🐳 Guia de Deploy com Docker

Este guia explica como fazer o deploy do Tower RPG usando Docker.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)
- Portas 3000, 8080 e 3306 disponíveis (ou configure outras no `.env`)

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.docker.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
MYSQL_ROOT_PASSWORD=sua_senha_root
DB_NAME=tower_rpg
DB_USER=tower_user
DB_PASS=sua_senha_db

# JWT
JWT_SECRET=sua_chave_secreta_super_segura

# Portas
API_PORT=8080
FRONTEND_PORT=3000
```

### 2. Build e Iniciar Containers

```bash
# Build e iniciar todos os serviços
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### 3. Inicializar Banco de Dados

Após os containers iniciarem, execute os scripts SQL:

```bash
# Acessar o container do MySQL
docker exec -it tower-mysql mysql -u root -p

# Ou executar scripts diretamente
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < backend/database/install-tables.sql
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backend/database/setup-reference-data.sql
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backend/database/create-test-users.sql
```

## 🏗️ Estrutura dos Containers

### Serviços

1. **db** (MySQL 8.0)
   - Porta: 3306
   - Volume: `mysql_data`
   - Scripts SQL em `backend/database/` são executados automaticamente

2. **backend** (PHP 8.2-FPM)
   - PHP-FPM na porta 9000 (interno)
   - Código em `backend/src/`
   - Dependências instaladas via Composer

3. **nginx-api** (Nginx)
   - Porta: 8080 (configurável)
   - Proxy reverso para PHP-FPM
   - Serve a API em `/api`

4. **frontend** (Nginx)
   - Porta: 3000 (configurável)
   - Serve arquivos estáticos do build
   - Proxy para API em `/api`

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (com logs)
docker-compose up

# Rebuild após mudanças
docker-compose up -d --build

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Acessar shell do container
docker exec -it tower-backend bash
docker exec -it tower-mysql bash
```

### Produção

```bash
# Usar compose de produção
docker-compose -f docker-compose.prod.yml up -d --build

# Parar serviços de produção
docker-compose -f docker-compose.prod.yml down

# Ver logs de produção
docker-compose -f docker-compose.prod.yml logs -f
```

### Manutenção

```bash
# Backup do banco de dados
docker exec tower-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} > backup.sql

# Restaurar backup
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backup.sql

# Limpar volumes (CUIDADO: apaga dados!)
docker-compose down -v

# Limpar imagens não utilizadas
docker system prune -a
```

## 🌐 Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## 🔒 Segurança em Produção

### Checklist de Produção

- [ ] Alterar todas as senhas padrão no `.env`
- [ ] Usar `JWT_SECRET` forte e único
- [ ] Configurar `API_DEBUG=false`
- [ ] Usar HTTPS (configurar certificado SSL)
- [ ] Restringir acesso ao MySQL (não expor porta 3306 publicamente)
- [ ] Configurar firewall adequadamente
- [ ] Fazer backups regulares do banco de dados
- [ ] Monitorar logs regularmente

### Configuração de HTTPS

Para produção, você precisará:

1. Configurar um proxy reverso (Nginx/Traefik) com SSL
2. Obter certificados SSL (Let's Encrypt)
3. Configurar redirecionamento HTTP → HTTPS

Exemplo de configuração Nginx com SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs [nome-do-servico]

# Verificar status
docker-compose ps

# Reiniciar serviço específico
docker-compose restart [nome-do-servico]
```

### Erro de conexão com banco

```bash
# Verificar se MySQL está saudável
docker-compose ps db

# Ver logs do MySQL
docker-compose logs db

# Testar conexão manualmente
docker exec -it tower-mysql mysql -u root -p
```

### Erro 502 Bad Gateway

- Verificar se o PHP-FPM está rodando: `docker-compose logs backend`
- Verificar configuração do Nginx: `docker exec -it tower-nginx-api cat /etc/nginx/conf.d/default.conf`

### Frontend não carrega

- Verificar se o build foi feito: `docker-compose logs frontend`
- Verificar se os arquivos estão no volume: `docker exec -it tower-frontend ls -la /usr/share/nginx/html`

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PHP-FPM](https://www.php.net/manual/en/install.fpm.php)
- [Nginx](https://nginx.org/en/docs/)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Verifique as variáveis de ambiente no `.env`
3. Verifique se as portas estão disponíveis
4. Verifique se os volumes estão montados corretamente

