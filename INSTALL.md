# Guia de Instalação - Tower RPG

## Pré-requisitos

- PHP 8.1 ou superior
- MySQL 8.0 ou superior (ou acesso ao servidor remoto)
- Composer
- Node.js e npm

## Instalação Rápida

### 1. Instalar Dependências do Frontend

```bash
npm install
```

### 2. Instalar Dependências do Backend

```bash
cd backend
composer install
cd ..
```

### 3. Configurar Banco de Dados

O arquivo `config.env` já está configurado com as credenciais do servidor remoto:
- Host: 193.203.175.91
- Database: u737502399_Tower
- User: u737502399_Tower

### 4. Criar Tabelas no Banco de Dados

Execute o script de instalação das tabelas:

```bash
mysql -h 193.203.175.91 -u u737502399_Tower -p u737502399_Tower < backend/database/install-tables.sql
```

Quando solicitado, digite a senha: `Tower@kokkos03`

### 5. Testar Conexão

```bash
php backend/scripts/test-connection.php
```

Se tudo estiver correto, você verá:
```
✓ Conexão estabelecida com sucesso!
✓ Query de teste executada: 1
```

### 6. Build do Projeto

```bash
npm run build
```

Isso irá:
1. Fazer build do frontend React
2. Instalar dependências do Composer (produção)
3. Copiar o backend para `build/api/`

## Desenvolvimento

### Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Backend

```bash
cd backend/public
php -S localhost:8000
```

A API estará disponível em `http://localhost:8000`

## Estrutura de Build

Após o build, a estrutura será:

```
build/
├── assets/          # Assets do frontend (JS, CSS)
├── index.html       # HTML do frontend
└── api/             # Backend PHP completo
    ├── src/
    ├── public/
    ├── vendor/
    └── ...
```

## Verificação

1. **Teste de Conexão**: Execute `php backend/scripts/test-connection.php`
2. **Teste da API**: Acesse `http://localhost:8000/api/v1/auth/login` (deve retornar erro de método, mas não erro de conexão)
3. **Teste do Frontend**: Execute `npm run dev` e acesse `http://localhost:5173`

## Problemas Comuns

### Erro de Conexão com Banco

- Verifique se as credenciais no `config.env` estão corretas
- Verifique se o servidor MySQL está acessível
- Teste a conexão manualmente: `mysql -h 193.203.175.91 -u u737502399_Tower -p`

### Erro ao Executar Composer

- Certifique-se de que o Composer está instalado: `composer --version`
- Execute `composer install` dentro da pasta `backend/`

### Erro ao Fazer Build

- Certifique-se de que todas as dependências estão instaladas
- Verifique se há erros no console
- Tente limpar e reinstalar: `rm -rf node_modules && npm install`

## Próximos Passos

1. Criar um usuário mestre através da API ou diretamente no banco
2. Configurar o servidor web (Apache/Nginx) para servir o build
3. Ajustar CORS no `config.env` para o domínio de produção

