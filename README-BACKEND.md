# Backend PHP - Tower RPG API

## Requisitos

- PHP 8.1 ou superior
- MySQL 8.0 ou superior
- Composer

## Instalação

1. Instalar dependências do Composer:
```bash
cd backend
composer install
```

2. Configurar banco de dados:
   - Copiar `config.env` da raiz do projeto
   - Editar as variáveis de conexão:
     - `DB_HOST`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASS`
     - `DB_PORT`
     - `JWT_SECRET`

3. Criar tabelas no banco de dados:
```bash
# Se o banco já existe (como no caso do servidor remoto):
mysql -h 193.203.175.91 -u u737502399_Tower -p u737502399_Tower < backend/database/install-tables.sql

# Ou usando o script completo (cria o banco se não existir):
mysql -h 193.203.175.91 -u u737502399_Tower -p < backend/database/migrations.sql
```

4. Testar conexão:
```bash
php backend/scripts/test-connection.php
```

## Estrutura

```
backend/
├── src/
│   ├── controllers/     # Controllers da API
│   ├── models/          # Models de dados
│   ├── routes/           # Definição de rotas
│   ├── middleware/       # Middlewares (Auth, CORS, etc)
│   ├── services/        # Serviços (JWT, etc)
│   ├── database/        # Configuração do banco
│   └── utils/           # Utilitários
├── public/
│   └── index.php        # Entry point da API
└── composer.json        # Dependências PHP
```

## Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro

### Campanhas
- `GET /api/v1/campaigns` - Listar campanhas
- `GET /api/v1/campaigns/{id}` - Obter campanha
- `POST /api/v1/campaigns` - Criar campanha (master)
- `PUT /api/v1/campaigns/{id}` - Atualizar campanha (master)
- `DELETE /api/v1/campaigns/{id}` - Deletar campanha (master)

### Personagens
- `GET /api/v1/characters?campaign_id={id}` - Listar personagens
- `GET /api/v1/characters/{id}` - Obter personagem
- `POST /api/v1/characters` - Criar personagem
- `PUT /api/v1/characters/{id}` - Atualizar personagem
- `DELETE /api/v1/characters/{id}` - Deletar personagem

### NPCs
- `GET /api/v1/npcs?campaign_id={id}` - Listar NPCs
- `GET /api/v1/npcs/{id}` - Obter NPC
- `POST /api/v1/npcs` - Criar NPC (master)
- `PUT /api/v1/npcs/{id}` - Atualizar NPC (master)

### Ameaças
- `GET /api/v1/threats?campaign_id={id}` - Listar ameaças
- `GET /api/v1/threats/{id}` - Obter ameaça
- `POST /api/v1/threats` - Criar ameaça (master)
- `PUT /api/v1/threats/{id}` - Atualizar ameaça (master)

### Relatórios
- `GET /api/v1/reports?campaign_id={id}` - Listar relatórios
- `GET /api/v1/reports/{id}` - Obter relatório
- `POST /api/v1/reports` - Criar relatório (master)
- `PUT /api/v1/reports/{id}` - Atualizar relatório (master)

### Convocações
- `GET /api/v1/summons?campaign_id={id}` - Listar convocações
- `GET /api/v1/summons/{id}` - Obter convocação
- `POST /api/v1/summons` - Criar convocação (master)
- `POST /api/v1/summons/{id}/confirm` - Confirmar participação
- `POST /api/v1/summons/{id}/decline` - Recusar participação

### Documentos
- `GET /api/v1/documents?campaign_id={id}` - Listar documentos
- `GET /api/v1/documents/{id}` - Obter documento
- `POST /api/v1/documents` - Criar documento (master)
- `PUT /api/v1/documents/{id}` - Atualizar documento (master)

### Eventos
- `GET /api/v1/events?campaign_id={id}` - Listar eventos
- `GET /api/v1/events/{id}` - Obter evento
- `POST /api/v1/events` - Criar evento (master)
- `PUT /api/v1/events/{id}` - Atualizar evento (master)

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer {token}
```

## Build

O backend é automaticamente copiado para `build/api/` quando você executa:

```bash
npm run build
```

Isso executa:
1. Build do frontend (Vite)
2. Instalação das dependências do Composer
3. Cópia do backend para `build/api/`

## Desenvolvimento

Para desenvolvimento local, você pode usar o servidor PHP embutido:

```bash
cd backend/public
php -S localhost:8000
```

Ou configurar um servidor web (Apache/Nginx) apontando para `backend/public/`.

