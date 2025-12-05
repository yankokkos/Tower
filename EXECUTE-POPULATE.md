# Como Executar o Script de População

## Comando Rápido

Execute este comando no terminal (substitua o caminho se necessário):

```bash
mysql -u u737502399_Tower -p u737502399_Tower < backend/database/setup-reference-data.sql
```

**Senha:** `Tower@kokkos03`

## O que o Script Faz

1. **Cria 4 tabelas de referência:**
   - `planes` - Planos de origem
   - `equipment_templates` - Templates de equipamentos
   - `advantages` - Vantagens disponíveis
   - `disadvantages` - Desvantagens disponíveis

2. **Popula com dados:**
   - 23 planos
   - 20 equipamentos/armas
   - 13 vantagens
   - 16 desvantagens

## Verificação

Após executar, verifique:

```sql
SELECT 
  (SELECT COUNT(*) FROM planes) as planos,
  (SELECT COUNT(*) FROM equipment_templates) as equipamentos,
  (SELECT COUNT(*) FROM advantages) as vantagens,
  (SELECT COUNT(*) FROM disadvantages) as desvantagens;
```

Deve retornar: 23, 20, 13, 16

## Pronto!

Após executar, o frontend automaticamente:
- Carregará dados do banco quando disponível
- Usará dados locais como fallback se necessário

