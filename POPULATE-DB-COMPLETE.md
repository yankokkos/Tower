# População do Banco de Dados - Completo

## ✅ O que foi criado

### 1. Tabelas de Referência

**Arquivo:** `backend/database/create-reference-tables.sql`

Cria 4 tabelas:
- `planes` - Planos de origem (23 planos)
- `equipment_templates` - Templates de equipamentos (20 armas)
- `advantages` - Vantagens (13 vantagens)
- `disadvantages` - Desvantagens (16 desvantagens)

### 2. Script de População

**Arquivo:** `backend/database/setup-reference-data.sql`

Script completo que:
- Cria as tabelas (se não existirem)
- Popula com todos os dados do sistema Tower RPG
- Usa `INSERT IGNORE` para evitar duplicatas

### 3. Backend - Controller e Rotas

**Arquivos:**
- `backend/src/controllers/ReferenceDataController.php` - Controller para dados de referência
- `backend/src/routes/reference-data.php` - Rotas da API

**Endpoints criados:**
- `GET /api/v1/reference/planes` - Lista todos os planos
- `GET /api/v1/reference/equipment` - Lista equipamentos (filtros: type, category)
- `GET /api/v1/reference/advantages` - Lista vantagens (filtro: category)
- `GET /api/v1/reference/disadvantages` - Lista desvantagens (filtro: category)

### 4. Frontend - Integração

**Arquivo:** `src/services/api.ts`

Adicionados métodos:
- `api.getPlanes()`
- `api.getEquipmentTemplates(type?, category?)`
- `api.getAdvantages(category?)`
- `api.getDisadvantages(category?)`

**Arquivo:** `src/components/player/CharacterForm.tsx`

- Carrega dados do banco automaticamente ao montar
- Usa dados locais como fallback se o banco não estiver disponível
- Compatível com ambos os formatos (banco e local)

## 🚀 Como Executar

### Passo 1: Executar Script SQL

```bash
mysql -u u737502399_Tower -p u737502399_Tower < backend/database/setup-reference-data.sql
```

**Senha:** `Tower@kokkos03`

### Passo 2: Verificar

```sql
SELECT 
  'Planos' as tipo, COUNT(*) as total FROM planes
UNION ALL
SELECT 'Equipamentos', COUNT(*) FROM equipment_templates
UNION ALL
SELECT 'Vantagens', COUNT(*) FROM advantages
UNION ALL
SELECT 'Desvantagens', COUNT(*) FROM disadvantages;
```

**Resultado esperado:**
- Planos: 23
- Equipamentos: 20
- Vantagens: 13
- Desvantagens: 16

## 📊 Dados Populados

### Planos (23)
- **Elementais (Nível -2)**: Água, Terra, Ar, Fogo, Éter
- **Elementais (Nível -1)**: Plantas, Animais
- **Espelhos (Nível 1)**: Medo, Desejo
- **Interiores - Frutos (Nível 2)**: Amor, Alegria, Paz, Paciência, Amabilidade, Bondade, Fidelidade, Mansidão, Domínio Próprio
- **Interiores - Obras (Nível 2)**: Ódio, Tristeza, Discórdia, Ira, Crueldade, Maldade, Traição, Orgulho, Libertinagem
- **Exteriores (Nível 3)**: Caos, Ordem, Espiral do Inconsciente

### Equipamentos (20)
- **Corpo a Corpo (Uma Mão)**: Punho, Adaga, Espada Curta, Machado, Taco, Corrente
- **Corpo a Corpo (Duas Mãos)**: Espada Longa, Machado Grande, Lança, Cajado
- **Distância**: Arco, Besta, Pistola, Rifle, Lançador
- **Arcanas**: Bastão Mágico, Varita, Espada Rúnica, Adaga de Alma

### Vantagens (13)
- **Combate**: Reflexos Aguçados, Luta Aprimorada, Tiro Certeiro, Mestre
- **Social**: Presença Carismática, Mentor Influente
- **Mental**: Mente Forte, Inteligência Brilhante, Vontade Inquebrável
- **Sobrenatural**: Resistência Planar, Conexão Espiritual, Visão Onírica, Portador de Runas, Sussurros do Vento, Conexão Ancestral, Armadura Oculta

### Desvantagens (16)
- **Física**: Fraco/Frágil, Lento, Bronze em Forma de Gente
- **Psicológica**: Fobia, Culpa Existencial, Medo de Espelhos, Carrega o Luto, Instabilidade Sonora, Sussurros do Submundo
- **Social**: Infame, Dívida, Aura de Perda, Obcecado por Justiça, Obcecada por Outras Feiticeiras
- **Sobrenatural**: Maldição Planar, Presença Instável, Marcado por Sheol

## 🔄 Funcionamento

1. **Frontend carrega dados do banco** ao montar o formulário
2. **Se o banco não estiver disponível**, usa dados locais como fallback
3. **Dados do banco são a fonte de verdade** - podem ser atualizados sem deploy do frontend
4. **Conversão automática** de snake_case (banco) para camelCase (frontend)

## ✨ Benefícios

- ✅ Dados centralizados no banco
- ✅ Pode atualizar dados sem fazer deploy do frontend
- ✅ Fallback automático para dados locais
- ✅ API RESTful para consulta
- ✅ Filtros por categoria/type
- ✅ Compatível com estrutura existente

## 📝 Notas

- Os endpoints de referência **não requerem autenticação** (dados públicos)
- O script é **idempotente** - pode executar múltiplas vezes
- Usa `INSERT IGNORE` para evitar duplicatas
- Todos os campos JSON são decodificados automaticamente

