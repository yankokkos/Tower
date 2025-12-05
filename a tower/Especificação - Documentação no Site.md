# Especificação: Documentação do Sistema no Site Tower RPG

> _"A documentação não é apenas um manual. É um mapa. E todo mapa... pode ser redesenado."_

---

## Visão Geral

A seção de **Documentação do Sistema** é uma área **PÚBLICA** do site Tower RPG, acessível a todos os visitantes sem necessidade de login. Ela apresenta toda a documentação completa do sistema Tower RPG de forma navegável, pesquisável e integrada ao restante da plataforma.

**Acesso**: Público (sem login necessário)  
**Localização no Menu**: Item principal "Documentação" no menu lateral público

---

## Estrutura de Navegação

### Menu Lateral de Documentação

O menu lateral da documentação apresenta uma estrutura hierárquica completa dos 12 capítulos:

#### Estrutura Principal

```
📚 DOCUMENTAÇÃO
├── 🏠 Índice Geral
├── 📖 Capítulo 1 - Introdução
│   └── 01. Introdução ao Tower RPG
├── 🌌 Capítulo 2 - Cosmologia
│   ├── 01. Introdução à Cosmologia
│   ├── 02. Estrutura dos Planos
│   ├── 03. Interação entre Planos
│   ├── 04. O Mundo e os Planos
│   ├── 📁 Planos Fundamentais
│   │   ├── Nível -∞ - O Vazio Primordial
│   │   ├── Nível -3 - Alicerces Fundamentais
│   │   ├── Nível -2 - Planos Primordiais
│   │   ├── Nível -1 - Planos Vitais
│   │   └── Nível 0 - Plano Material
│   ├── 📁 Planos Superiores
│   │   ├── Nível 1 - Planos Espelhos
│   │   ├── Nível 2 - Planos Interiores
│   │   ├── Nível 3 - Planos Exteriores
│   │   └── 📁 Dualidades (9 arquivos)
│   └── 📁 Transcendência
│       └── Nível ∞ - A Criação e o Altíssimo
├── 🎲 Capítulo 3 - Sistema de Rolagem
│   └── 01. Sistema de Rolagem e Testes
├── 👤 Capítulo 4 - Criação de Personagem
│   ├── 01. Criação de Personagem
│   ├── 02. Atributos e Status
│   ├── 03. Perícias e Especializações
│   ├── 04. Vantagens e Desvantagens
│   └── 05. Rótulos
├── ✨ Capítulo 5 - Seeds e Poderes
│   ├── 01. Seeds - Natureza e Tipos
│   ├── 02. Temas de Poder
│   ├── 03. Cartas de Poder
│   ├── 04. Controle e Colapso Simbólico
│   ├── 05. Magia Combinatória - Ars Magica
│   └── 06. Integração com Cosmologia
├── ⚔️ Capítulo 6 - Combate e Equipamentos
│   ├── 01. Sistema de Combate
│   ├── 02. Equipamentos e Artefatos
│   └── 03. Arsenal da Tower
├── 🏛️ Capítulo 7 - A Tower
│   ├── 01. História da Tower
│   ├── 02. Divisões da Tower
│   ├── 03. Hierarquia e Patentes
│   ├── 04. Facções e Organizações
│   ├── 05. Bases Globais - Torres
│   └── 06. Filosofia da Tower
├── 🎯 Capítulo 8 - Missões
│   ├── 01. Missões e Conflitos
│   ├── 02. Tipos de Missões
│   ├── 03. Briefing de Missão
│   ├── 04. Progressão Narrativa
│   ├── 05. Temas e Atmosfera
│   ├── 06. Dilemas Morais
│   └── 07. Elementos de Mundo Vivo
├── 📈 Capítulo 9 - Progressão
│   ├── 01. Progresso e Evolução
│   └── 02. Desenvolvimento dos Personagens
├── 🎭 Capítulo 10 - Guia do Mestre
│   ├── 01. Guia do Mestre
│   └── 02. Catálogo de Ameaças
├── 📿 Capítulo 11 - Referências Judaico-Cristãs
│   └── 01. Referências Judaico-Cristãs e Cosmologia Profunda
└── 📋 Capítulo 12 - Apêndices
    ├── 01. Templates de Ficha
    ├── 02. Templates de Missão
    ├── 03. Contos e Narrativas
    ├── 04. Tabelas de Referência Rápida
    ├── 05. Geradores Aleatórios
    ├── 06. Referência de Planos
    ├── 07. Glossário
    ├── 08. Recursos e Cronograma
    └── 09. Mensagem Final e Índice
```

### Funcionalidades do Menu Lateral

- **Expansão/Colapso**: Capítulos podem ser expandidos ou colapsados
- **Indicador de Posição Atual**: Destacar o documento atual sendo visualizado
- **Contador de Progresso**: Mostrar quantos documentos foram lidos (requer login)
- **Busca Rápida**: Campo de busca dentro do menu para filtrar documentos
- **Marcadores Visuais**: Ícones diferentes para cada tipo de conteúdo
- **Badges de Novidade**: Indicar documentos novos ou atualizados recentemente

---

## Layout e Visualização

### Estrutura da Página de Documentação

A página de documentação possui três áreas principais:

#### 1. Barra Superior de Documentação

**Elementos**:
- **Breadcrumb**: Mostrar caminho completo (ex: Documentação > Capítulo 4 > Criação de Personagem)
- **Título do Documento**: Nome do arquivo atual
- **Ações Rápidas**:
  - 🔖 Favoritar (requer login)
  - 📝 Adicionar Nota (requer login)
  - 📤 Compartilhar Link
  - 📄 Exportar PDF
  - 🖨️ Imprimir
  - ⚙️ Configurações de Visualização

#### 2. Área de Conteúdo Principal

**Layout em Três Colunas**:

```
┌─────────────┬──────────────────────────┬─────────────┐
│             │                          │             │
│   Menu      │    Conteúdo do           │   Painel    │
│   Lateral   │    Documento            │   Lateral   │
│   (Fixo)    │    (Scrollável)          │   (Opcional)│
│             │                          │             │
│             │    - Título              │   - Índice  │
│             │    - Conteúdo Markdown   │     do Doc  │
│             │    - Seções              │   - Links   │
│             │    - Tabelas             │     Rápidos │
│             │    - Imagens             │   - Cards   │
│             │    - Código              │     de Ref  │
│             │                          │             │
└─────────────┴──────────────────────────┴─────────────┘
```

**Painel Lateral Direito (Opcional)**:
- **Índice do Documento**: Navegação rápida pelas seções do documento atual
- **Links Rápidos**: Links para documentos relacionados
- **Cards de Referência**: Regras rápidas mencionadas no documento
- **Calculadora Integrada**: Mini-calculadora de dados D10 sempre visível
- **Glossário Contextual**: Termos do documento atual com definições rápidas

#### 3. Barra Inferior de Navegação

**Elementos**:
- **Documento Anterior**: Link para documento anterior na ordem
- **Documento Seguinte**: Link para próximo documento
- **Voltar ao Índice**: Retornar ao índice geral
- **Progresso de Leitura**: Barra mostrando progresso no capítulo (requer login)

---

## Modos de Visualização

### Modo de Leitura (Padrão)

**Características**:
- Layout limpo e focado no conteúdo
- Tipografia otimizada para leitura (fonte serifada ou sans-serif legível)
- Espaçamento generoso entre linhas
- Contraste adequado (texto verde neon sobre fundo preto)
- Largura de texto limitada para melhor legibilidade
- Sem distrações visuais excessivas

**Recursos**:
- Scroll suave
- Marcador de posição automático (salva onde parou de ler - requer login)
- Modo de foco (esconde menu lateral ao pressionar F)
- Ajuste de tamanho de fonte
- Contraste alto/baixo (acessibilidade)

### Modo de Referência Rápida

**Características**:
- Layout compacto
- Cards destacados para regras importantes
- Tabelas sempre visíveis
- Busca instantânea dentro do documento
- Links rápidos para seções relacionadas

**Ativação**: Botão "Modo Referência" na barra superior

**Uso Ideal**: Durante sessões de jogo, consulta rápida de regras

### Modo de Estudo

**Características**:
- Anotações destacadas
- Marcadores de texto
- Resumo automático de seções
- Quiz/testes de compreensão (opcional)
- Histórico de leitura detalhado

**Ativação**: Requer login, botão "Modo Estudo" na barra superior

**Uso Ideal**: Para jogadores novos aprendendo o sistema

---

## Funcionalidades Especiais

### 1. Busca Full-Text

**Localização**: Barra superior do site (busca global) + busca específica na documentação

**Funcionalidades**:
- Busca em todos os 12 capítulos simultaneamente
- Busca por palavras-chave, frases exatas, ou termos específicos
- Filtros avançados:
  - Por capítulo específico
  - Por tipo de conteúdo (regras, exemplos, tabelas)
  - Por tags
- Resultados destacados com contexto
- Sugestões de busca relacionada
- Histórico de buscas (requer login)

**Exemplo de Resultado**:
```
Busca: "Seed incorporada"
Resultados:
  ✓ Capítulo 5 > Seeds - Natureza e Tipos
    "...quando uma Seed é incorporada ao corpo de um agente..."
  ✓ Capítulo 5 > Temas de Poder
    "...Seed incorporada permite acesso a..."
```

### 2. Links Internos Inteligentes

**Funcionalidade**:
- Conversão automática de links Obsidian `[[arquivo]]` em links funcionais
- Tooltips ao passar o mouse mostrando preview do documento linkado
- Links que abrem em nova aba ou painel lateral
- Breadcrumb automático ao navegar por links

**Exemplo**:
- Link `[[Capítulo 04 - Criação de Personagem/02. Atributos e Status]]` se torna um link clicável com tooltip mostrando preview

### 3. Calculadora de Dados Integrada

**Localização**: Painel lateral direito + barra flutuante

**Funcionalidades**:
- Cálculo de rolagens D10 (1d10, 2d10, 3d10)
- Modificadores automáticos baseados no contexto do documento
- Histórico de rolagens
- Modo rápido para rolagens comuns
- Detecção de críticos (1 ou 10)

**Integração**:
- Ao ler sobre perícias, botão "Rolar Perícia" aparece automaticamente
- Ao ler sobre combate, calculadora de ataque aparece

### 4. Referência Rápida (Cards)

**Localização**: Painel lateral direito + popup ao clicar em termos

**Conteúdo**:
- Cards destacados com regras mais usadas
- Exemplos:
  - "Tabela de Dificuldades Padrão"
  - "Modificadores de Combate"
  - "Níveis de Contenção de Ameaças"
  - "Sistema de XP"
- Cards podem ser fixados na tela
- Cards podem ser exportados como imagem

### 5. Glossário Contextual

**Funcionalidade**:
- Termos técnicos destacados no texto
- Ao passar o mouse ou clicar, mostra definição rápida
- Link para entrada completa no Glossário (Capítulo 12)
- Histórico de termos consultados

**Exemplo**:
- Texto: "O agente incorporou uma Seed de Fogo"
- "Seed" aparece destacado em verde
- Ao clicar: Popup com definição rápida + link para Glossário completo

### 6. Tabelas Interativas

**Funcionalidades**:
- Tabelas podem ser ordenadas por coluna
- Filtros em tabelas grandes
- Exportar tabela como CSV
- Imprimir tabela formatada
- Busca dentro da tabela

**Exemplo**:
- Tabela de Perícias pode ser filtrada por categoria
- Tabela de Ameaças pode ser ordenada por nível de perigo

### 7. Visualização de Planos (Especial para Capítulo 2)

**Funcionalidade Especial para Cosmologia**:
- Visualização interativa da estrutura dos planos
- Diagrama navegável mostrando níveis -∞ a ∞
- Clicar em um plano mostra informações rápidas
- Links diretos para documentos de cada plano
- Modo 3D opcional (visualização em camadas)

**Implementação**:
- Diagrama SVG/Canvas interativo
- Zoom e pan
- Camadas que podem ser ativadas/desativadas
- Tooltips informativos

### 8. Favoritos e Anotações (Requer Login)

**Favoritos**:
- Marcar documentos ou seções específicas como favoritos
- Acesso rápido via menu "Meus Favoritos"
- Organizar favoritos em pastas
- Compartilhar lista de favoritos

**Anotações**:
- Adicionar notas pessoais a qualquer documento
- Notas privadas (apenas o usuário vê)
- Notas compartilhadas (com mestre/jogadores da campanha)
- Notas podem ser exportadas
- Busca dentro das anotações

### 9. Histórico de Leitura (Requer Login)

**Funcionalidades**:
- Rastrear quais documentos foram lidos
- Marcar documentos como "Lido", "Em Leitura", "Para Ler"
- Continuar de onde parou automaticamente
- Estatísticas de leitura:
  - Tempo gasto em cada capítulo
  - Documentos completados
  - Progresso geral
- Recomendações baseadas no progresso

### 10. Exportação e Compartilhamento

**Exportar PDF**:
- Gerar PDF de documento individual
- Gerar PDF de capítulo completo
- Gerar PDF personalizado (selecionar seções)
- Formatação otimizada para impressão
- Incluir índice e numeração de páginas

**Compartilhar Link**:
- Gerar link direto para seção específica
- Link inclui âncora para posição exata
- Preview do link compartilhado
- Links podem ser marcados como públicos ou privados

**Exportar Markdown**:
- Baixar documento original em Markdown
- Manter formatação Obsidian
- Útil para uso offline ou em outros editores

---

## Integração com Outras Áreas do Site

### Links Contextuais

**Da Documentação para Outras Áreas**:

1. **Para Fichas de Personagem**:
   - Ao ler sobre criação de personagem, link "Criar Personagem" aparece
   - Ao ler sobre atributos, link para calculadora de atributos

2. **Para Arquivo de Ameaças**:
   - Ao ler sobre ameaças no Guia do Mestre, link para catálogo completo
   - Ao ler sobre contenção, link para ameaças contidas na campanha (se autenticado)

3. **Para Calculadora**:
   - Links contextuais para calculadora de dados em seções sobre rolagens
   - Calculadora pré-configurada baseada no contexto

4. **Para Templates**:
   - Ao ler Templates de Ficha, botão "Usar Template" que abre criador de personagem
   - Ao ler Templates de Missão, botão "Criar Missão" que abre criador de missões

### Widgets Contextuais

**Widgets que aparecem dinamicamente**:

- **Widget de Perícia**: Ao ler sobre perícias, widget mostra lista completa
- **Widget de Seed**: Ao ler sobre Seeds, widget mostra tipos disponíveis
- **Widget de Plano**: Ao ler sobre planos, widget mostra estrutura visual
- **Widget de Regra Rápida**: Cards com regras relacionadas ao conteúdo atual

---

## Recursos Visuais e de UX

### Estética Visual

**Tema Verde/Preto Futurista**:
- Fundo preto (#000000, #0A0A0A)
- Texto verde neon (#00FF41) para títulos e destaques
- Texto branco/cinza claro para corpo do texto
- Bordas e separadores em verde neon sutil
- Efeitos de glow sutis em elementos interativos

**Elementos Visuais**:
- Grid hexagonal sutil no fundo
- Linhas geométricas decorativas
- Animações de loading com tema
- Transições suaves entre páginas
- Efeitos de hover discretos

### Tipografia

**Hierarquia**:
- Títulos H1: Fonte futurista, grande, verde neon
- Títulos H2-H6: Fonte sans-serif moderna, tamanhos decrescentes
- Corpo do texto: Fonte legível, tamanho confortável (16-18px)
- Código: Fonte monoespaçada, fundo escuro, texto verde

**Legibilidade**:
- Espaçamento entre linhas: 1.6-1.8
- Espaçamento entre parágrafos: 1.5em
- Largura máxima de texto: 70-80 caracteres
- Contraste adequado (WCAG AA)

### Responsividade

**Desktop (>1024px)**:
- Layout completo em três colunas
- Menu lateral sempre visível
- Painel lateral direito opcional

**Tablet (768px - 1024px)**:
- Menu lateral colapsável
- Painel lateral direito como overlay
- Layout adaptado em duas colunas principais

**Mobile (<768px)**:
- Menu lateral como drawer (abre/fecha)
- Conteúdo em coluna única
- Painel lateral como modal
- Navegação por swipe
- Botões de ação grandes e acessíveis

---

## Funcionalidades Avançadas (Futuras)

### Fase 2 - Expansões

1. **Modo Offline**:
   - Download de documentação completa para leitura offline
   - Sincronização quando online novamente

2. **Modo Colaborativo**:
   - Comentários públicos em documentos
   - Discussões sobre regras específicas
   - Sugestões de melhorias da comunidade

3. **Versões da Documentação**:
   - Histórico de versões
   - Comparar versões diferentes
   - Notas de atualização

4. **Tradução**:
   - Suporte a múltiplos idiomas
   - Tradução colaborativa
   - Toggle entre idiomas

### Fase 3 - IA e Automação

1. **Assistente de Regras**:
   - IA que responde perguntas sobre regras
   - Sugestões baseadas no contexto
   - Explicações simplificadas

2. **Geração de Conteúdo**:
   - Gerar exemplos baseados nas regras
   - Criar cenários de teste
   - Sugerir combinações de regras

---

## Acessibilidade

### Recursos de Acessibilidade

1. **Navegação por Teclado**:
   - Todas as funcionalidades acessíveis via teclado
   - Atalhos de teclado documentados
   - Foco visível em elementos interativos

2. **Leitores de Tela**:
   - Estrutura semântica adequada
   - Textos alternativos em imagens
   - Labels descritivos em botões

3. **Contraste e Cores**:
   - Modo alto contraste disponível
   - Não depende apenas de cor para informação
   - Opção de tema claro/escuro

4. **Tamanho de Texto**:
   - Controles para aumentar/diminuir fonte
   - Zoom do navegador funciona corretamente
   - Texto responsivo

---

## Performance e Otimização

### Carregamento

- **Lazy Loading**: Carregar documentos sob demanda
- **Cache**: Cachear documentos frequentemente acessados
- **Pré-carregamento**: Pré-carregar próximo documento previsto
- **Compressão**: Comprimir conteúdo Markdown

### Otimizações

- **Busca Indexada**: Índice pré-construído para busca rápida
- **CDN**: Servir conteúdo estático via CDN
- **Service Workers**: Cache offline básico
- **Otimização de Imagens**: Imagens otimizadas e lazy-loaded

---

## Métricas e Analytics

### Dados Coletados (Anônimos)

- Documentos mais acessados
- Tempo médio de leitura por documento
- Taxa de conclusão de leitura
- Termos mais buscados
- Seções mais consultadas
- Padrões de navegação

### Uso dos Dados

- Melhorar organização da documentação
- Identificar conteúdo que precisa de mais explicação
- Otimizar experiência do usuário
- Priorizar melhorias

---

## Considerações Finais

A seção de Documentação do Sistema é o coração público do site Tower RPG. Ela deve ser:

1. **Acessível**: Fácil de navegar e encontrar informações
2. **Completa**: Toda a documentação disponível
3. **Funcional**: Ferramentas úteis integradas
4. **Bonita**: Estética que reforça o tema do jogo
5. **Rápida**: Carregamento e navegação fluidos
6. **Intuitiva**: Usuários encontram o que precisam facilmente

A documentação não é apenas um manual técnico - é uma experiência imersiva que introduz novos jogadores ao universo Tower RPG e serve como referência confiável para jogadores experientes.

---

> _"Cada página é uma porta. Cada seção é um caminho. A documentação não apenas informa - ela transforma."_

#documentação #site #especificação #tower #rpg

