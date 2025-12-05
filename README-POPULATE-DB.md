# Como Popular o Banco de Dados com Dados de Referência

Este guia explica como popular o banco de dados com os dados pré-definidos do sistema Tower RPG.

## Dados Disponíveis

O script popula as seguintes tabelas de referência:

1. **planes** - Planos de Origem (23 planos)
2. **equipment_templates** - Templates de Equipamentos/Armas (20 armas)
3. **advantages** - Vantagens (13 vantagens)
4. **disadvantages** - Desvantagens (16 desvantagens)

## Como Executar

### Opção 1: Script Completo (Recomendado)

Execute o script completo que cria as tabelas e popula os dados:

```bash
mysql -u seu_usuario -p seu_banco < backend/database/setup-reference-data.sql
```

### Opção 2: Scripts Separados

Se preferir executar em etapas:

1. **Criar tabelas:**
```bash
mysql -u seu_usuario -p seu_banco < backend/database/create-reference-tables.sql
```

2. **Popular dados:**
```bash
mysql -u seu_usuario -p seu_banco < backend/database/populate-reference-data.sql
```

### Opção 3: Via MySQL CLI

Conecte-se ao MySQL e execute:

```sql
USE seu_banco;
SOURCE backend/database/setup-reference-data.sql;
```

## Verificação

Após executar, verifique se os dados foram inseridos:

```sql
-- Verificar planos
SELECT COUNT(*) as total_planos FROM planes;
-- Deve retornar 23

-- Verificar equipamentos
SELECT COUNT(*) as total_equipamentos FROM equipment_templates;
-- Deve retornar 20

-- Verificar vantagens
SELECT COUNT(*) as total_vantagens FROM advantages;
-- Deve retornar 13

-- Verificar desvantagens
SELECT COUNT(*) as total_desvantagens FROM disadvantages;
-- Deve retornar 16
```

## Endpoints da API

Após popular o banco, os seguintes endpoints estarão disponíveis:

- `GET /api/v1/reference/planes` - Lista todos os planos
- `GET /api/v1/reference/equipment` - Lista equipamentos (opcional: `?type=weapon&category=corpo-a-corpo`)
- `GET /api/v1/reference/advantages` - Lista vantagens (opcional: `?category=combate`)
- `GET /api/v1/reference/disadvantages` - Lista desvantagens (opcional: `?category=fisica`)

## Notas Importantes

1. **INSERT IGNORE**: O script usa `INSERT IGNORE` para evitar erros se os dados já existirem
2. **Idempotente**: Pode executar múltiplas vezes sem duplicar dados
3. **Sem Autenticação**: Os endpoints de referência não requerem autenticação (dados públicos)

## Atualizar Dados

Se precisar atualizar os dados:

1. **Limpar dados existentes:**
```sql
DELETE FROM planes;
DELETE FROM equipment_templates;
DELETE FROM advantages;
DELETE FROM disadvantages;
```

2. **Executar o script novamente:**
```bash
mysql -u seu_usuario -p seu_banco < backend/database/populate-reference-data.sql
```

## Integração com Frontend

O frontend pode usar esses dados de duas formas:

1. **Carregar do banco** (recomendado): Usar os endpoints da API
2. **Usar dados locais**: Manter os arquivos TypeScript como fallback

Os dados do banco são a fonte de verdade e podem ser atualizados sem precisar fazer deploy do frontend.

