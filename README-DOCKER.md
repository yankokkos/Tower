# 🐳 Deploy com Docker - Guia Rápido

## 🚀 Início Rápido

### 1. Configurar Ambiente

```bash
# Copiar arquivo de exemplo
cp docker/env.example .env

# Editar .env com suas configurações
nano .env  # ou use seu editor preferido
```

### 2. Iniciar Aplicação

```bash
# Opção 1: Usar script de inicialização
chmod +x docker/start.sh
./docker/start.sh

# Opção 2: Comandos manuais
docker-compose up -d --build
```

### 3. Inicializar Banco de Dados

```bash
# Aguardar MySQL estar pronto (cerca de 10-15 segundos)
sleep 15

# Executar scripts SQL
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < backend/database/install-tables.sql
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backend/database/setup-reference-data.sql
docker exec -i tower-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backend/database/create-test-users.sql
```

## 📋 Estrutura

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## 🔧 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reiniciar um serviço
docker-compose restart backend

# Acessar shell do container
docker exec -it tower-backend bash
```

## 📚 Documentação Completa

Veja `DOCKER.md` para documentação detalhada.

