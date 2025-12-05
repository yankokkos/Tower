# Deploy no Coolify v4.0.0-beta.452

Este guia explica como fazer o deploy do backend Node.js no Coolify usando Git.

## Pré-requisitos

- VPS com Coolify v4.0.0-beta.452 instalado
- Repositório Git configurado (GitHub, GitLab, etc)
- Acesso SSH ao servidor (se necessário)

## Passo 1: Configurar Repositório no Coolify

1. Acesse o painel do Coolify
2. Crie um novo **Resource** ou **Application**
3. Selecione **Git Repository** como fonte
4. Configure:
   - **Repository URL**: URL do seu repositório Git
   - **Branch**: `main` ou `master` (ou a branch desejada)
   - **Build Pack**: Selecione **Docker** ou **Node.js**

## Passo 2: Configurar Build

### Opção A: Usando Dockerfile (Recomendado)

1. No Coolify, certifique-se de que o **Dockerfile** está sendo detectado
2. O Coolify deve detectar automaticamente o `Dockerfile` na pasta `backend/`
3. Se necessário, configure o **Dockerfile Path**: `backend/Dockerfile`

### Opção B: Build Manual

Se o Coolify não detectar o Dockerfile automaticamente:

1. Configure o **Build Command**: `cd backend && npm install && npm run build`
2. Configure o **Start Command**: `cd backend && node dist/index.js`
3. Configure o **Working Directory**: `backend`

## Passo 3: Configurar Variáveis de Ambiente

No Coolify, adicione as seguintes variáveis de ambiente:

```env
# Banco de Dados MySQL
DB_HOST=193.203.175.91
DB_NAME=u737502399_Tower
DB_USER=u737502399_Tower
DB_PASS=Tower@kokkos03
DB_PORT=3306

# JWT
JWT_SECRET=TowerRPG_2024_Secure_Key_Change_In_Production_If_Needed
JWT_EXPIRATION=86400

# API
API_ENV=production
API_DEBUG=false
PORT=5001

# CORS (ajuste com o domínio do seu frontend)
CORS_ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

**Importante**: 
- Não use a porta padrão (80, 443, 3000, 8080) se já estiver em uso
- Ajuste `CORS_ALLOWED_ORIGINS` com os domínios do seu frontend
- Em produção, use um `JWT_SECRET` mais seguro

## Passo 4: Configurar Porta

1. No Coolify, configure a **Port** para `5001` (ou a porta desejada)
2. Se estiver usando um proxy reverso (Traefik, Nginx), configure o mapeamento de porta
3. Certifique-se de que a porta não está em conflito com outros serviços

## Passo 5: Deploy Manual

1. No painel do Coolify, vá até a aplicação criada
2. Clique em **Deploy** ou **Redeploy**
3. O Coolify irá:
   - Clonar o repositório Git
   - Executar o build (Dockerfile ou comandos configurados)
   - Iniciar o container
4. Aguarde o deploy completar

## Passo 6: Verificar Deploy

1. Verifique os logs no Coolify para garantir que não há erros
2. Teste o endpoint de health check:
   ```bash
   curl http://seu-servidor:5001/health
   ```
3. A resposta deve ser:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "database": "connected"
   }
   ```

## Passo 7: Configurar Proxy Reverso (Opcional)

Se estiver usando Traefik ou Nginx no Coolify:

1. Configure o **Domain** no Coolify
2. O Coolify irá configurar automaticamente o proxy reverso
3. A API estará acessível em `https://api.seu-dominio.com`

## Troubleshooting

### Erro de Conexão com Banco de Dados

- Verifique se as credenciais do MySQL estão corretas
- Verifique se o servidor MySQL permite conexões remotas
- Teste a conexão manualmente:
  ```bash
  mysql -h 193.203.175.91 -u u737502399_Tower -p
  ```

### Erro de Build

- Verifique os logs do build no Coolify
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o TypeScript está compilando corretamente

### Porta em Uso

- Escolha uma porta diferente (ex: 5002, 5003)
- Atualize a variável `PORT` no Coolify
- Reinicie o container

### CORS Errors

- Verifique se `CORS_ALLOWED_ORIGINS` inclui o domínio do frontend
- Certifique-se de que não há espaços extras na lista de origens
- O formato deve ser: `domain1.com,domain2.com` (sem espaços)

## Atualizações Futuras

Para atualizar a aplicação:

1. Faça commit e push das alterações para o Git
2. No Coolify, clique em **Redeploy**
3. O Coolify irá fazer pull das alterações e fazer rebuild

## Notas Importantes

- O Coolify gerencia automaticamente os containers Docker
- Não é necessário configurar Docker Compose manualmente
- O health check endpoint (`/health`) é usado pelo Coolify para monitoramento
- Certifique-se de que o banco de dados MySQL está acessível do servidor

## Estrutura de Arquivos no Repositório

```
tower-rpg/
├── backend/
│   ├── Dockerfile          # Dockerfile para build
│   ├── package.json        # Dependências Node.js
│   ├── tsconfig.json       # Configuração TypeScript
│   └── src/                # Código fonte
├── frontend/               # Frontend (não usado no deploy do backend)
└── config.env              # Variáveis de ambiente (não commitar)
```

O Coolify irá usar apenas a pasta `backend/` para o deploy.

