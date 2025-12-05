
# Tower RPG System Specification

This is a code bundle for Tower RPG System Specification. The original project is available at https://www.figma.com/design/fz3zTvXzymNz1jWLAF36ZY/Tower-RPG-System-Specification.

## 🚀 Início Rápido

### Opção 1: Docker (Recomendado para Deploy)

```bash
# Configurar ambiente
cp docker/env.example .env
# Editar .env com suas configurações

# Iniciar aplicação
make start

# Ou usando docker-compose diretamente
docker-compose up -d --build
make init-db
```

**Acesse:**
- Frontend: http://localhost:3000
- API: http://localhost:8080/api

📚 **Documentação Docker completa**: Veja [DOCKER.md](DOCKER.md) ou [DOCKER-SETUP.md](DOCKER-SETUP.md)

### Opção 2: Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📚 Documentação

- [DOCKER.md](DOCKER.md) - Guia completo de deploy com Docker
- [DOCKER-SETUP.md](DOCKER-SETUP.md) - Resumo da configuração Docker
- [README-DOCKER.md](README-DOCKER.md) - Guia rápido Docker
- [CREATE-TEST-USERS.md](CREATE-TEST-USERS.md) - Criar usuários de teste

## 🛠️ Comandos Úteis (Docker)

```bash
make help          # Ver todos os comandos disponíveis
make start         # Build, iniciar e inicializar banco
make logs          # Ver logs de todos os containers
make down          # Parar containers
make init-db       # Inicializar banco de dados
make shell-backend # Acessar shell do backend
```
  