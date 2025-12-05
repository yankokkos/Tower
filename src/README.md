# 🎮 Tower RPG - Sistema de Gerenciamento de Campanhas

> _"Cada arquivo é uma peça do quebra-cabeça. Cada terminal é uma porta para o impossível."_

Sistema web completo para gerenciamento de campanhas do Tower RPG, com tema visual retro-futurista inspirado em Tron: O Legado (verde neon + preto).

## 📋 Visão Geral

O Tower RPG é um sistema de gerenciamento de campanhas de RPG que permite:

- **Jogadores**: Criar e gerenciar personagens completos
- **Mestres**: Criar campanhas, NPCs, ameaças, relatórios e muito mais
- **Interface futurista**: Tema visual único com cores neon e efeitos de brilho

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login e registro de usuários
- Separação de roles (Jogador/Mestre)
- Persistência de sessão com localStorage

### 👤 Área do Jogador
- Dashboard com visão geral de personagens e campanhas
- Criação completa de personagens com:
  - Atributos (sistema escalonado de pontos)
  - Perícias e especializações
  - Vantagens e desvantagens
  - Rótulos de poder e fraqueza
  - Plano Interior
  - Equipamentos
  - História e relacionamentos
- Visualização detalhada de fichas
- Edição de personagens existentes
- Status derivados calculados automaticamente (PV, PS, PE)
- **Gerenciamento de Recursos em tempo real**:
  - Modificar PV (causar dano/curar)
  - Gastar/recuperar PS (Pontos Simbólicos)
  - Gastar/recuperar PE (Pontos de Energia)
  - Botões rápidos para valores comuns
  - Restaurar todos os recursos de uma vez
  - Barras de progresso animadas com cores dinâmicas

### 🎲 Área do Mestre
- Dashboard com estatísticas gerais
- Gerenciamento de campanhas:
  - Criar e editar campanhas
  - Visualizar personagens dos jogadores
  - Criar e gerenciar NPCs
  - Criar e gerenciar ameaças/monstros
- **Sistema de Relatórios**:
  - Criar relatórios de sessões, missões, análises
  - Marcar como privado (só mestre) ou compartilhado
  - Sistema de tags para organização
  - Filtros por tipo (sessão, missão, ameaça, personagem, geral)
- **Sistema de Convocações**:
  - Agendar sessões com data/hora
  - Convidar jogadores específicos
  - Jogadores podem confirmar ou recusar presença
  - Visualização de quem confirmou
  - Alertas para sessões próximas
- **Documentação de Campanha**:
  - Criar documentos (lore, regras, anotações)
  - Organizar por categorias
  - Controle de visibilidade (privado ou compartilhado)
  - Sistema de tags
  - Suporte a markdown (formatação simples)
- **Timeline de Eventos**:
  - Registro cronológico de eventos importantes
  - Tipos: missões, descobertas, mortes, conquistas
  - Relacionar personagens, NPCs e ameaças
  - Visualização em linha do tempo
- Sistema de classificação de ameaças (Safe, Eucalipto, Keter, Apollyon)
- Notas privadas do mestre
- Ferramentas avançadas de gestão

## 🎨 Tema Visual

### Paleta de Cores
- **Verde Neon Primário**: #00FF41
- **Verde Neon Escuro**: #00CC33
- **Verde Neon Claro**: #33FF66
- **Preto**: #000000
- **Preto Claro**: #0A0A0A
- **Preto Mais Claro**: #1A1A1A
- **Cinza Escuro**: #333333
- **Cinza Médio**: #666666
- **Texto Primário**: #FFFFFF
- **Texto Secundário**: #CCCCCC
- **Texto Opaco**: #999999

### Efeitos Especiais
- Bordas com brilho neon
- Sombras com efeito glow
- Animações suaves
- Hover effects com intensificação de brilho
- Barras de progresso animadas

## 🏗️ Estrutura do Projeto

```
tower-rpg/
├── types/                  # Definições TypeScript
│   └── index.ts           # Interfaces principais
├── mocks/                 # Dados mock para desenvolvimento
│   ├── users.mock.ts
│   ├── campaigns.mock.ts
│   ├── characters.mock.ts
│   ├── npcs.mock.ts
│   └── threats.mock.ts
├── services/              # Serviços de API
│   └── mockApi.ts        # API mock simulando backend
├── utils/                # Utilitários
│   └── auth.ts          # Gerenciamento de autenticação
├── components/
│   ├── common/           # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── auth/            # Autenticação
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── player/          # Área do jogador
│   │   ├── PlayerDashboard.tsx
│   │   ├── CharacterSheet.tsx
│   │   └── CharacterForm.tsx
│   └── master/          # Área do mestre
│       ├── MasterDashboard.tsx
│       ├── CampaignView.tsx
│       ├── CampaignForm.tsx
│       ├── NPCForm.tsx
│       └── ThreatForm.tsx
├── styles/
│   └── globals.css       # Tema global Tower RPG
└── App.tsx              # Componente principal
```

## 🚀 Como Usar

### Login de Teste

Usuários pré-cadastrados para teste:

**Mestre:**
- Email: `master@tower.com`
- Senha: qualquer senha (sistema mock)

**Jogadores:**
- Email: `player1@tower.com`
- Email: `player2@tower.com`
- Senha: qualquer senha (sistema mock)

### Criar Novo Usuário

1. Clique em "Não tem conta? Registre-se"
2. Preencha os dados:
   - Nome completo
   - Email
   - Senha (mínimo 8 caracteres)
   - Escolha o role (Jogador ou Mestre)
3. Clique em "Criar Conta"

### Como Jogador

1. Faça login com uma conta de jogador
2. No dashboard, clique em "Novo Personagem"
3. Preencha todas as informações:
   - **Informações Básicas**: Nome, conceito, origem, idade, etc.
   - **Atributos**: Distribua 30 pontos entre os 7 atributos (sistema escalonado)
   - **Perícias**: Adicione perícias relevantes
   - **Rótulos**: Defina poder e fraqueza
   - **Plano Interior**: Escolha Fruto ou Obra
   - **Equipamento**: Adicione armas, armaduras, ferramentas
   - **História**: Escreva a história do personagem
4. Clique em "Salvar Personagem"
5. Visualize a ficha completa do personagem

### Editando um Personagem

1. Na visualização do personagem, clique em "Editar"
2. Modifique os campos desejados
3. Clique em "Salvar Personagem"
4. Você será redirecionado para a visualização atualizada

### Usando Recursos Durante o Jogo

Quando você estiver visualizando seu próprio personagem, poderá gerenciar recursos em tempo real:

#### Modificar PV (Pontos de Vida)
1. Clique em "Modificar" na seção de PV
2. Digite a quantidade de dano ou cura
3. Clique em "Causar Dano" (diminui PV) ou "Curar" (aumenta PV)
4. Use os botões rápidos (-5, -1, +1, +5) para ajustes rápidos

#### Gastar/Recuperar PS (Pontos Simbólicos)
1. Clique em "Modificar" na seção de PS
2. Digite a quantidade
3. Clique em "Gastar PS" ou "Recuperar PS"
4. Use os botões rápidos para valores comuns

#### Gastar/Recuperar PE (Pontos de Energia)
1. Clique em "Modificar" na seção de PE
2. Digite a quantidade
3. Clique em "Gastar PE" ou "Recuperar PE"
4. Ideal para rastrear uso de poderes

#### Restaurar Tudo
- Após descanso longo, clique em "Restaurar Tudo" para voltar PV, PS e PE aos máximos

### Como Mestre

1. Faça login com uma conta de mestre
2. No dashboard, clique em "Nova Campanha"
3. Preencha:
   - Nome da campanha
   - Descrição detalhada
   - Status inicial
4. Dentro da campanha, você pode:
   - **Ver Personagens**: Todos os personagens dos jogadores
   - **Criar NPCs**: Adicione NPCs importantes da campanha
   - **Criar Ameaças**: Registre criaturas, entidades, anomalias
   - **Gerenciar**: Acompanhe o progresso da campanha

### Criando um NPC

1. Entre em uma campanha
2. Na seção NPCs, clique em "Novo NPC"
3. Preencha:
   - Nome e afiliação
   - Descrição física e comportamental
   - Patente/cargo
   - Status (vivo, ferido, etc.)
   - Histórico de aparições
   - Notas privadas do mestre
4. Salve o NPC

### Criando uma Ameaça

1. Entre em uma campanha
2. Na seção Ameaças, clique em "Nova Ameaça"
3. Preencha:
   - Nome e código de classificação
   - Tipo (criatura, entidade, anomalia, etc.)
   - Descrição e origem planar
   - **Classificação**:
     - Nível de contenção (Safe → Apollyon)
     - Nível de perigo (Baixo → Crítico)
   - **Capacidades**: Liste os poderes da ameaça
   - **Fraquezas**: Como derrotá-la
   - **Stats de Combate**: PV, defesa, ataques
   - **Procedimentos de Contenção**: Como mantê-la contida
4. Salve a ameaça

### Gerenciando Relatórios de Sessão

1. Dentro de uma campanha, role até a seção "Relatórios"
2. Clique em "Novo Relatório"
3. Escolha o tipo: Sessão, Missão, Ameaça, Personagem ou Geral
4. Marque como privado (só você vê) ou compartilhado com jogadores
5. Adicione tags para organização
6. Escreva o conteúdo (suporte básico a markdown)
7. Salve o relatório

**Dica**: Use relatórios de sessão para documentar o que aconteceu, relatórios de ameaça para análises táticas, e relatórios privados para seus planos secretos!

### Convocando Jogadores para Sessões

1. Na seção "Convocações", clique em "Nova Convocação"
2. Defina título e data/hora da sessão
3. Escreva uma mensagem explicando o que vai acontecer
4. Selecione quais jogadores convidar
5. Salve a convocação

Os jogadores receberão a convocação e poderão:
- Confirmar presença (botão verde)
- Recusar (botão vermelho)
- Ver detalhes da sessão

**Como jogador**: Você verá as convocações pendentes com um ícone de sino. Confirme sua presença para ajudar o mestre a planejar!

### Criando Documentação de Campanha

1. Na seção "Documentação", clique em "Novo Documento"
2. Escolha uma categoria: lore, rules, notes, ou outra
3. Marque como privado (anotações do mestre) ou compartilhado (lore para jogadores)
4. Adicione tags para facilitar busca
5. Escreva o conteúdo
6. Salve o documento

**Use documentos para**:
- Lore do mundo (compartilhado com jogadores)
- Regras customizadas da campanha
- Anotações privadas sobre plots secretos
- Informações sobre NPCs, locais, facções

### Registrando Eventos na Timeline

1. Na seção "Timeline", clique em "Novo Evento"
2. Escolha o tipo: Missão, Descoberta, Morte, Conquista, Outro
3. Defina a data do evento (na cronologia da campanha)
4. Escreva título e descrição
5. Relacione personagens, NPCs e ameaças envolvidos
6. Salve o evento

A timeline mostra todos os eventos em ordem cronológica reversa, criando um registro visual da história da campanha!

## 📊 Sistema de Atributos

### Escalonamento de Pontos

O sistema usa pontos escalonados para atributos:

- **Níveis 1-3**: 1 ponto cada
- **Níveis 4-6**: 2 pontos cada
- **Níveis 7-9**: 3 pontos cada
- **Nível 10**: 4 pontos

**Total máximo na criação**: 30 pontos

### Status Derivados

Calculados automaticamente:

- **PV (Pontos de Vida)**: Constituição × 5 + bônus de armadura
- **PS (Pontos Simbólicos)**: Sabedoria × 5 + bônus de vantagens
- **PE (Pontos de Energia)**: Poder × 5 + bônus de Seeds
- **Defesa**: Destreza + 2
- **Iniciativa**: Destreza

## 🎯 Classificação de Ameaças

### Níveis de Contenção

- **Safe**: Seguro, fácil de conter
- **Eucalipto**: Requer observação constante
- **Keter**: Extremamente perigoso, difícil de conter
- **Apollyon**: Catastrófico, pode destruir a realidade

### Níveis de Perigo

- **Baixo**: Risco mínimo
- **Médio**: Risco moderado
- **Alto**: Risco significativo
- **Crítico**: Risco extremo

## 🔮 Próximas Funcionalidades

- [ ] Sistema de Seeds e poderes avançado
- [ ] Chat em tempo real
- [ ] Rolagem de dados integrada
- [ ] Mapas e localizações
- [ ] Sistema de inventário avançado
- [ ] Integração com banco de dados real
- [ ] API REST completa
- [ ] Notificações em tempo real
- [ ] Upload de imagens para personagens/NPCs
- [ ] Exportação de fichas em PDF
- [ ] Sistema de permissões avançado (convidar jogadores por email)
- [ ] Editor markdown avançado para documentos
- [ ] Sistema de busca global
- [ ] Backup e restauração de campanhas

## 🛠️ Tecnologias Utilizadas

- **React 18+** com TypeScript
- **Tailwind CSS** v4.0 (inline theming)
- **Lucide React** (ícones)
- **localStorage** para persistência
- **Mock API** para desenvolvimento

## 📝 Notas de Desenvolvimento

### Sistema Mock

Atualmente, o sistema usa uma API mock que simula:
- Delay de rede
- Validações básicas
- Armazenamento em memória (array em mock)

Para migrar para produção:
1. Implementar backend com Express + Prisma
2. Substituir `mockApi` por chamadas reais
3. Adicionar autenticação JWT
4. Implementar validações server-side

### Estrutura de Dados

Todas as interfaces TypeScript estão prontas para serem usadas com Prisma.
O schema do banco de dados pode ser gerado diretamente das interfaces.

## 🎨 Customização do Tema

Para alterar as cores do tema, edite `/styles/globals.css`:

```css
:root {
  --neon-green: #00FF41;      /* Cor principal */
  --black: #000000;           /* Fundo principal */
  /* ... outras variáveis ... */
}
```

## 🐛 Problemas Conhecidos

- [ ] Edição de personagens recarrega a lista (melhorar UX)
- [ ] Falta validação de campos em alguns formulários
- [ ] Imagens de perfil não implementadas
- [ ] Sistema de permissões simplificado
- [ ] Sem suporte para múltiplas campanhas por jogador

## 📜 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

> _"Cada linha de código é um passo em direção à Tower Digital. Cada commit é uma operação concluída."_

**Desenvolvido com ⚡ por jogadores, para jogadores.**