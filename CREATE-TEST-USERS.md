# Criar Usuários de Teste

Este documento explica como criar usuários de teste para o sistema Tower RPG.

## Método 1: Script SQL (Recomendado)

Execute o script SQL diretamente no seu banco de dados MySQL:

```sql
-- Execute o arquivo:
backend/database/create-test-users.sql
```

### Credenciais Criadas:

**PLAYERS (5 usuários):**
- Email: `player1@tower.com` | Senha: `player123`
- Email: `player2@tower.com` | Senha: `player123`
- Email: `player3@tower.com` | Senha: `player123`
- Email: `player4@tower.com` | Senha: `player123`
- Email: `player5@tower.com` | Senha: `player123`

**MASTER (1 usuário):**
- Email: `master@tower.com` | Senha: `master123`

## Método 2: Script PHP (Alternativo)

Execute o script PHP que cria os usuários dinamicamente:

```bash
php backend/scripts/create-test-users.php
```

Este script:
- Verifica se os usuários já existem antes de criar
- Gera os hashes de senha automaticamente
- Mostra um resumo dos usuários criados

## Importante

⚠️ **ATENÇÃO**: Essas são credenciais de teste! Em produção, você deve:
1. Remover ou desabilitar esses usuários
2. Criar usuários reais através do formulário de registro
3. Usar senhas seguras e únicas

## Verificar Usuários Criados

Para verificar se os usuários foram criados, você pode executar:

```sql
SELECT id, email, name, role, created_at FROM users WHERE email LIKE '%@tower.com';
```

## Notas

- Todos os players têm a mesma senha: `player123`
- O mestre tem senha: `master123`
- Os IDs são fixos para facilitar testes (mas você pode alterar no script SQL)
- O script SQL usa `INSERT IGNORE` para evitar erros se os usuários já existirem

