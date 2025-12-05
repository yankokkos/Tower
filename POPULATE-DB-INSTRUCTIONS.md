# Instruções para Popular o Banco de Dados

## Passo a Passo

### 1. Executar Script SQL

Execute o script completo que cria as tabelas e popula os dados:

```bash
mysql -u u737502399_Tower -p u737502399_Tower < backend/database/setup-reference-data.sql
```

Quando solicitado, digite a senha: `Tower@kokkos03`

### 2. Verificar Dados Inseridos

Conecte-se ao MySQL e verifique:

```sql
mysql -u u737502399_Tower -p u737502399_Tower

-- Verificar contagens
SELECT 'Planos' as tabela, COUNT(*) as total FROM planes
UNION ALL
SELECT 'Equipamentos', COUNT(*) FROM equipment_templates
UNION ALL
SELECT 'Vantagens', COUNT(*) FROM advantages
UNION ALL
SELECT 'Desvantagens', COUNT(*) FROM disadvantages;
```

### 3. Testar Endpoints da API

Os seguintes endpoints estarão disponíveis (sem autenticação):

- `GET http://seu-servidor/api/v1/reference/planes`
- `GET http://seu-servidor/api/v1/reference/equipment`
- `GET http://seu-servidor/api/v1/reference/advantages`
- `GET http://seu-servidor/api/v1/reference/disadvantages`

### 4. Frontend

O frontend já está configurado para:
- Tentar carregar dados do banco primeiro
- Usar dados locais como fallback se o banco não estiver disponível

## Dados Populados

- **23 Planos** de origem (elementais, interiores, exteriores, espelhos)
- **20 Equipamentos** (armas corpo a corpo, distância e arcanas)
- **13 Vantagens** (combate, social, mental, sobrenatural)
- **16 Desvantagens** (física, psicológica, social, sobrenatural)

## Notas

- O script usa `INSERT IGNORE` para evitar duplicatas
- Pode executar múltiplas vezes sem problemas
- Os dados do banco são a fonte de verdade
- O frontend usa fallback para dados locais se necessário

