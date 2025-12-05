# Migração do Banco de Dados

## Novos Campos Adicionados

A tabela `characters` foi expandida para incluir os seguintes campos:

- `codename` - Codinome do personagem
- `motivation` - Motivação do personagem
- `xp_history` - Histórico de ganhos e gastos de XP (JSON)
- `attention` - Sistema de atenção por tema (JSON)

## Como Aplicar a Migração

### Opção 1: Se o banco já existe

Execute o script de migração:

```bash
mysql -u seu_usuario -p seu_banco < backend/database/migration-add-new-fields.sql
```

Ou execute diretamente no MySQL:

```sql
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS codename VARCHAR(255) NULL AFTER name,
ADD COLUMN IF NOT EXISTS motivation TEXT NULL AFTER appearance,
ADD COLUMN IF NOT EXISTS xp_history JSON NULL AFTER level,
ADD COLUMN IF NOT EXISTS attention JSON NULL AFTER xp_history;
```

### Opção 2: Se está criando o banco do zero

O arquivo `backend/database/install-tables.sql` já inclui todos os novos campos. Basta executar:

```bash
mysql -u seu_usuario -p seu_banco < backend/database/install-tables.sql
```

## Verificação

Após aplicar a migração, verifique se os campos foram criados:

```sql
DESCRIBE characters;
```

Você deve ver os novos campos:
- `codename`
- `motivation`
- `xp_history`
- `attention`

## Notas

- Os campos `xp_history` e `attention` são do tipo JSON e podem armazenar arrays/objetos
- Todos os novos campos são opcionais (NULL permitido)
- O backend já está preparado para lidar com esses campos automaticamente

