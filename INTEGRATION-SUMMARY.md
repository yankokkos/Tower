# Resumo da Integração com Banco de Dados

## Alterações Realizadas

### 1. Schema do Banco de Dados

**Arquivo:** `backend/database/install-tables.sql`

Adicionados novos campos à tabela `characters`:
- `codename` VARCHAR(255) - Codinome do personagem
- `motivation` TEXT - Motivação do personagem  
- `xp_history` JSON - Histórico de ganhos e gastos de XP
- `attention` JSON - Sistema de atenção por tema (de desvantagens)

### 2. Script de Migração

**Arquivo:** `backend/database/migration-add-new-fields.sql`

Script SQL para adicionar os novos campos em bancos existentes.

### 3. Model PHP Atualizado

**Arquivo:** `backend/src/models/Character.php`

**Melhorias:**
- Suporte aos novos campos (codename, motivation, xp_history, attention)
- Conversão automática entre snake_case (banco) e camelCase (frontend)
- Cálculo melhorado de status derivados:
  - PE agora inclui +10 se tiver Seed ativa
  - Defesa calculada como 10 + Destreza + bônus de armadura
- Funções `convertToCamelCase()` e `convertToSnakeCase()` para mapeamento de campos

### 4. Frontend Atualizado

**Arquivo:** `src/components/player/CharacterForm.tsx`

**Melhorias:**
- Inicialização correta de todos os campos opcionais
- useEffect para atualizar formData quando character mudar
- Sistema de atenção atualizado automaticamente ao adicionar/remover desvantagens
- XP total atualizado ao adicionar desvantagens

## Como Aplicar

### Passo 1: Executar Migração do Banco

Se o banco já existe, execute:

```bash
mysql -u seu_usuario -p seu_banco < backend/database/migration-add-new-fields.sql
```

Ou execute diretamente no MySQL:

```sql
ALTER TABLE characters ADD COLUMN codename VARCHAR(255) NULL AFTER name;
ALTER TABLE characters ADD COLUMN motivation TEXT NULL AFTER appearance;
ALTER TABLE characters ADD COLUMN xp_history JSON NULL AFTER level;
ALTER TABLE characters ADD COLUMN attention JSON NULL AFTER xp_history;
```

### Passo 2: Verificar Backend

O backend já está preparado para:
- Receber dados em camelCase do frontend
- Converter automaticamente para snake_case para o banco
- Retornar dados em camelCase para o frontend

### Passo 3: Testar

1. Criar um novo personagem com todos os campos
2. Verificar se todos os dados são salvos corretamente
3. Editar o personagem e verificar se os dados são carregados corretamente
4. Testar adicionar/remover vantagens, desvantagens, seeds, etc.

## Campos Suportados

### Informações Básicas
- ✅ name
- ✅ codename (novo)
- ✅ concept
- ✅ origin
- ✅ age
- ✅ appearance
- ✅ motivation (novo)
- ✅ code
- ✅ rank
- ✅ division

### Sistema de Progressão
- ✅ xp (disponível)
- ✅ xpTotal (total acumulado)
- ✅ level
- ✅ xpHistory (novo) - Histórico de ganhos/gastos

### Vantagens e Desvantagens
- ✅ advantages - Lista de vantagens com custos
- ✅ disadvantages - Lista de desvantagens com ganhos de XP
- ✅ attention (novo) - Sistema de atenção por tema

### Seeds e Poderes
- ✅ seeds - Tipo, plano, nível, modificadores
- ✅ powerThemes - Temas de poder
- ✅ powerCards - Cartas de poder com efeitos

### Outros
- ✅ skills - Perícias com especializações
- ✅ equipment - Equipamentos com propriedades
- ✅ relationships - Relacionamentos
- ✅ labels - Rótulos de poder e fraqueza
- ✅ innerPlane - Plano interior

## Notas Importantes

1. **Conversão de Formatos**: O backend converte automaticamente entre snake_case (banco) e camelCase (frontend)

2. **Campos JSON**: Os seguintes campos são armazenados como JSON:
   - attributes
   - statusDerived
   - skills
   - advantages
   - disadvantages
   - labels
   - innerPlane
   - seeds
   - powerThemes
   - powerCards
   - equipment
   - relationships
   - xpHistory
   - attention

3. **Valores Padrão**: Todos os campos opcionais têm valores padrão definidos no frontend e backend

4. **Cálculo Automático**: Status derivados (PV, PS, PE, Defesa) são calculados automaticamente baseado em atributos, equipamentos e seeds

