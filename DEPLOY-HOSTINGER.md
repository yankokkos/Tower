# Deploy na Hostinger com Cloudify

Este guia explica como fazer deploy do Tower RPG na Hostinger usando Cloudify e Docker.

## Pré-requisitos

1. Conta na Hostinger com acesso ao Cloudify
2. Repositório Git configurado: `https://github.com/yankokkos/Tower.git`
3. Banco de dados MySQL configurado (pode ser externo ou interno)

## Passo 1: Preparar o Repositório

Certifique-se de que os seguintes arquivos estão no repositório:

- `Dockerfile.production` (ou `Dockerfile`)
- `docker-compose.yml`
- `.dockerignore`
- `config.env` (ou variáveis de ambiente configuradas no Cloudify)

## Passo 2: Configurar no Cloudify

### 2.1. Criar Nova Aplicação

1. Acesse o painel Cloudify da Hostinger
2. Clique em "Nova Aplicação" ou "Deploy from Git"
3. Selecione o repositório: `https://github.com/yankokkos/Tower.git`
4. Escolha a branch (geralmente `main` ou `master`)

### 2.2. Configurar Build

**Dockerfile:** `Dockerfile.production` (ou `Dockerfile`)

**Build Context:** `.` (raiz do projeto)

**Build Command:** (deixe vazio, o Dockerfile já faz o build)

### 2.3. Configurar Variáveis de Ambiente

No painel do Cloudify, configure as seguintes variáveis de ambiente:

```env
# Banco de Dados
DB_HOST=193.203.175.91
DB_NAME=u737502399_Tower
DB_USER=u737502399_Tower
DB_PASS=Tower@kokkos03
DB_PORT=3306

# JWT
JWT_SECRET=TowerRPG_2024_Secure_Key_Change_In_Production
JWT_EXPIRATION=86400

# API
API_ENV=production
API_DEBUG=false

# CORS (ajuste com o domínio da Hostinger)
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
```

### 2.4. Configurar Porta

- **Porta Externa:** 80 (ou a porta fornecida pela Hostinger)
- **Porta Interna:** 80

### 2.5. Configurar Volumes (Opcional)

Se precisar persistir dados:

- `/var/www/html/uploads` → Volume para uploads de arquivos

## Passo 3: Deploy

1. Clique em "Deploy" ou "Build & Deploy"
2. Aguarde o build completar (pode levar alguns minutos)
3. Verifique os logs para garantir que não há erros

## Passo 4: Verificar Banco de Dados

Certifique-se de que as tabelas estão criadas no banco de dados:

```bash
# Execute via SSH ou painel MySQL da Hostinger
mysql -h 193.203.175.91 -u u737502399_Tower -p u737502399_Tower < backend/database/install-tables.sql
```

## Passo 5: Testar Aplicação

1. Acesse a URL fornecida pela Hostinger
2. Teste o login com usuários de teste:
   - Email: `player1@tower.com`
   - Senha: `player123`

## Estrutura de Deploy

```
Hostinger Cloudify
├── Frontend (Nginx na porta 80)
│   └── Serve arquivos estáticos do build
├── Backend (Apache na porta 8080)
│   └── API PHP/Slim
└── Proxy Nginx
    └── /api → Backend Apache
```

## Troubleshooting

### Erro: "Composer autoload não encontrado"

**Solução:** Verifique se o build do Dockerfile está instalando as dependências do Composer corretamente.

### Erro: "Conexão com banco de dados falhou"

**Solução:** 
1. Verifique as credenciais do banco nas variáveis de ambiente
2. Certifique-se de que o IP do banco está acessível do container
3. Verifique se a porta 3306 está aberta

### Erro: "CORS bloqueado"

**Solução:** Ajuste a variável `CORS_ALLOWED_ORIGINS` com o domínio correto da Hostinger.

### Frontend não carrega

**Solução:**
1. Verifique se o build do frontend foi concluído
2. Verifique os logs do container
3. Certifique-se de que o Nginx está servindo os arquivos corretos

### API não responde

**Solução:**
1. Verifique se o Apache está rodando (porta 8080)
2. Verifique os logs do Apache: `docker logs <container>`
3. Teste a API diretamente: `curl http://localhost:8080/api/v1/reference-data/planes`

## Comandos Úteis (via SSH)

Se tiver acesso SSH:

```bash
# Ver logs do container
docker logs tower-rpg-app

# Entrar no container
docker exec -it tower-rpg-app bash

# Verificar processos
docker ps

# Reiniciar container
docker restart tower-rpg-app
```

## Atualizações Futuras

Para atualizar a aplicação:

1. Faça push das alterações para o repositório Git
2. No Cloudify, clique em "Redeploy" ou configure auto-deploy
3. Aguarde o novo build e deploy

## Notas Importantes

⚠️ **Segurança:**
- Altere o `JWT_SECRET` em produção
- Use senhas fortes para o banco de dados
- Configure HTTPS se disponível na Hostinger

⚠️ **Performance:**
- O build pode levar 5-10 minutos na primeira vez
- Builds subsequentes são mais rápidos devido ao cache do Docker

⚠️ **Banco de Dados:**
- Se usar banco externo (como no exemplo), não precisa do serviço MySQL no docker-compose
- Comente ou remova o serviço `mysql` do `docker-compose.yml` se usar banco externo

## Suporte

Para problemas específicos da Hostinger, consulte:
- Documentação do Cloudify: https://www.hostinger.com.br/tutoriais/cloudify
- Suporte Hostinger: https://www.hostinger.com.br/contato

