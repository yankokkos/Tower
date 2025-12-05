# Especificação Técnica - Sistema Tower RPG

> _"Cada arquivo é uma peça do quebra-cabeça. Cada terminal é uma porta para o impossível."_

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Estrutura de Dados Completa](#estrutura-de-dados-completa)
4. [Mocks Provisórios](#mocks-provisórios)
5. [Regras de Negócio](#regras-de-negócio)
6. [Validações](#validações)
7. [APIs e Endpoints](#apis-e-endpoints)

---

## 🎯 Visão Geral

Sistema web completo para gerenciamento de campanhas do Tower RPG, incluindo:
- Sistema de autenticação (login/cadastro)
- Área do jogador (criar e gerenciar fichas)
- Área do mestre (visualizar todas as fichas + ferramentas avançadas)
- Tracker de campanhas
- Ferramentas do mestre (NPCs, monstros, relatórios, convocações, documentações)

**Tema Visual**: Verde neon (#00FF41) e preto (#000000), estilo retro-futurista inspirado em Tron: O Legado

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

**Frontend:**
- React 18+ com TypeScript
- Vite (build tool)
- React Router v6 (roteamento)
- Zustand (gerenciamento de estado)
- React Hook Form + Zod (formulários e validação)
- Axios (chamadas API)
- CSS Modules (estilização)

**Backend:**
- PHP 8.1+ com Slim Framework 4
- MySQL (banco de dados)
- PDO (acesso ao banco de dados)
- JWT (autenticação - firebase/php-jwt)
- password_hash/password_verify (hash de senhas)
- Composer (gerenciamento de dependências)

### Estrutura de Pastas

```
tower-rpg-site/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Componentes reutilizáveis
│   │   │   ├── player/           # Componentes da área do jogador
│   │   │   └── master/           # Componentes da área do mestre
│   │   ├── pages/
│   │   │   ├── auth/             # Login, cadastro
│   │   │   ├── player/           # Dashboard do jogador
│   │   │   ├── master/           # Dashboard do mestre
│   │   │   └── campaign/         # Páginas de campanha
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/             # API calls
│   │   ├── stores/               # Zustand stores
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Funções utilitárias
│   │   └── styles/               # Estilos globais e tema
│   └── public/
├── backend/
│   ├── src/
│   │   ├── routes/               # Rotas da API
│   │   ├── controllers/          # Lógica de negócio
│   │   ├── models/               # Modelos de dados
│   │   ├── middleware/           # Auth, validação, etc
│   │   ├── services/             # Serviços (JWT, etc)
│   │   ├── database/             # Configuração DB e migrations
│   │   └── utils/                # Utilitários
│   ├── public/
│   │   └── index.php             # Entry point da API
│   ├── database/
│   │   └── migrations.sql        # Schema MySQL
│   └── composer.json             # Dependências PHP
├── build/                         # Output do build
│   └── api/                       # Backend PHP copiado aqui
├── config.env                     # Configurações do banco de dados
└── shared/                       # Tipos compartilhados TypeScript
```

---

## 📊 Estrutura de Dados Completa

### 1. Usuário (User)

```typescript
interface User {
  id: string                    // UUID v4
  email: string                  // Email único, validado
  password: string              // Hash bcrypt (nunca retornar em API)
  name: string                  // Nome completo
  role: 'player' | 'master'     // Papel no sistema
  createdAt: Date              // Data de criação
  updatedAt: Date              // Última atualização
  lastLoginAt?: Date           // Último login (opcional)
  
  // Relações
  campaignsAsMaster?: Campaign[]      // Campanhas onde é mestre
  campaignsAsPlayer?: Campaign[]      // Campanhas onde é jogador
  characters?: Character[]             // Personagens criados
}
```

**Validações:**
- Email deve ser único
- Email deve ser válido (regex)
- Senha mínimo 8 caracteres
- Nome mínimo 2 caracteres
- Role deve ser 'player' ou 'master'

---

### 2. Campanha (Campaign)

```typescript
interface Campaign {
  id: string                    // UUID v4
  name: string                  // Nome da campanha
  description: string           // Descrição/background
  masterId: string              // FK para User (mestre)
  status: 'active' | 'paused' | 'completed' | 'archived'
  createdAt: Date
  updatedAt: Date
  startedAt?: Date             // Data de início (opcional)
  completedAt?: Date           // Data de conclusão (opcional)
  
  // Relações
  master: User                          // Mestre da campanha
  players: User[]                       // Jogadores participantes
  characters: Character[]               // Fichas dos jogadores
  npcs: NPC[]                           // NPCs da campanha
  threats: Threat[]                    // Ameaças/monstros
  reports: Report[]                    // Relatórios
  summons: Summon[]                     // Convocações
  documents: Document[]                // Documentações
  events: CampaignEvent[]               // Eventos da timeline
}
```

**Validações:**
- Nome obrigatório, mínimo 3 caracteres
- MasterId deve existir e ser usuário com role 'master'
- Status deve ser um dos valores válidos

---

### 3. Ficha de Personagem (Character)

```typescript
interface Character {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  playerId: string              // FK para User (dono da ficha)
  
  // === INFORMAÇÕES BÁSICAS ===
  name: string                  // Nome do personagem
  concept: string               // Conceito/arquétipo
  origin: string                // Origem (antes da Tower)
  age: number                   // Idade
  appearance?: string           // Descrição física (opcional)
  code?: string                 // Código de identificação Tower (ex: TWR-AG-2024-8472)
  rank?: string                 // Patente na Tower (opcional)
  division?: string             // Divisão de afiliação (opcional)
  recruitmentDate?: Date        // Data de recrutamento (opcional)
  status: 'active' | 'mission' | 'injured' | 'mia' | 'kia'
  
  // === ATRIBUTOS (7 atributos, cada um de 1 a 10) ===
  attributes: {
    forca: number              // 1-10, padrão: 1
    destreza: number           // 1-10, padrão: 1
    constituicao: number       // 1-10, padrão: 1
    inteligencia: number       // 1-10, padrão: 1
    sabedoria: number          // 1-10, padrão: 1
    carisma: number            // 1-10, padrão: 1
    poder: number              // 1-10, padrão: 1
  }
  
  // === STATUS DERIVADOS (calculados automaticamente) ===
  statusDerived: {
    pv: number                 // PV = Constituição × 5 + bônus de armadura
    pvMax: number              // PV máximo atual
    ps: number                 // PS = Sabedoria × 5 + bônus de vantagens
    psMax: number              // PS máximo atual
    pe: number                 // PE = Poder × 5 + bônus de Seeds
    peMax: number              // PE máximo atual
    defense: number            // Defesa (calculada)
    initiative: number         // Iniciativa (calculada)
  }
  
  // === PERÍCIAS ===
  skills: Array<{
    id: string                 // UUID
    name: string               // Nome da perícia
    attribute: string          // Atributo base ('forca', 'destreza', etc)
    level: number             // Nível da perícia (0-5)
    specializations?: Array<{ // Especializações (opcional)
      id: string
      name: string
      level: number           // Nível da especialização (1-3)
    }>
  }>
  
  // === VANTAGENS ===
  advantages: Array<{
    id: string
    name: string               // Nome da vantagem
    description: string       // Descrição do efeito
    cost: number              // Custo em XP
    mechanicalEffect?: string // Efeito mecânico (opcional)
  }>
  
  // === DESVANTAGENS ===
  disadvantages: Array<{
    id: string
    name: string               // Nome da desvantagem
    description: string       // Descrição do efeito
    xpGain: number            // XP ganho ao criar personagem
    penalty?: string          // Penalidade mecânica (opcional)
    attentionTheme?: string   // Tema de atenção gerado (opcional)
  }>
  
  // === RÓTULOS ===
  labels: {
    power: string             // Rótulo de poder
    weakness: string          // Rótulo de fraqueza
  }
  
  // === PLANO INTERIOR ===
  innerPlane: {
    name: string              // Nome do plano (ex: "Paciência", "Ira")
    type: 'fruit' | 'work'   // Fruto (bom) ou Obra (escuro)
    description: string       // Descrição da influência
  }
  
  // === SEEDS E PODERES ===
  seeds: Array<{
    id: string
    name: string              // Nome da Seed
    type: string              // Tipo da Seed
    level: number             // Nível da Seed
    description: string       // Descrição
    controlLevel: number      // Nível de controle (0-10)
    collapseRisk: number      // Risco de colapso simbólico (0-10)
  }>
  
  powerThemes: Array<{        // Temas de poder ativos
    id: string
    name: string
    description: string
  }>
  
  powerCards: Array<{         // Cartas de poder disponíveis
    id: string
    name: string
    theme: string             // Tema relacionado
    cost: number              // Custo em PE
    description: string
  }>
  
  // === EQUIPAMENTOS ===
  equipment: Array<{
    id: string
    name: string
    type: 'weapon' | 'armor' | 'tool' | 'artifact' | 'consumable' | 'other'
    description: string
    properties?: {             // Propriedades mecânicas (opcional)
      bonus?: number
      damage?: string
      defense?: number
      [key: string]: any
    }
    equipped: boolean          // Se está equipado
    quantity?: number         // Quantidade (para consumíveis)
  }>
  
  // === HISTÓRICO E RELACIONAMENTOS ===
  history: string             // História pessoal resumida
  relationships: Array<{
    id: string
    type: 'mentor' | 'ally' | 'rival' | 'enemy' | 'love' | 'other'
    name: string
    description: string
    npcId?: string            // FK para NPC (se for NPC da campanha)
  }>
  
  // === METADADOS ===
  xp: number                  // Experiência atual
  xpTotal: number             // XP total ganho
  level?: number              // Nível (se aplicável)
  
  createdAt: Date
  updatedAt: Date
  createdBy: string           // FK para User (quem criou)
  lastModifiedBy: string      // FK para User (último a modificar)
  
  // Relações
  campaign: Campaign
  player: User
}
```

**Validações:**
- Nome obrigatório, mínimo 2 caracteres
- Todos os atributos devem estar entre 1 e 10
- Soma total de atributos na criação deve ser ≤ 30 pontos (sistema escalonado)
- PV, PS, PE calculados automaticamente
- Skills: level entre 0-5, specializations level entre 1-3
- Status deve ser um dos valores válidos

**Cálculos Automáticos:**
```typescript
// PV = Constituição × 5 + bônus de armadura
pv = attributes.constituicao * 5 + (equipment.find(e => e.equipped && e.type === 'armor')?.properties?.defense || 0)

// PS = Sabedoria × 5 + bônus de vantagens
ps = attributes.sabedoria * 5 + advantages.reduce((sum, adv) => sum + (adv.mechanicalEffect?.includes('PS') ? 5 : 0), 0)

// PE = Poder × 5 + bônus de Seeds
pe = attributes.poder * 5 + seeds.reduce((sum, seed) => sum + (seed.level * 2), 0)
```

---

### 4. NPC (Non-Player Character)

```typescript
interface NPC {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  masterId: string              // FK para User (criador)
  
  name: string                  // Nome do NPC
  description: string           // Descrição física/comportamental
  affiliation: string           // Afiliação (Tower, facção rival, etc)
  rank?: string                 // Patente/cargo (opcional)
  age?: number                  // Idade (opcional)
  appearance?: string          // Aparência física (opcional)
  
  // Atributos simplificados (opcional, para NPCs importantes)
  attributes?: {
    forca?: number
    destreza?: number
    constituicao?: number
    inteligencia?: number
    sabedoria?: number
    carisma?: number
    poder?: number
  }
  
  // Perícias relevantes (opcional)
  skills?: Array<{
    name: string
    level: number
  }>
  
  // Relacionamentos
  relationships: Array<{
    characterId?: string        // FK para Character
    npcId?: string              // FK para outro NPC
    type: string
    description: string
  }>
  
  // Histórico
  history: string              // Histórico de aparições
  notes: string                // Notas privadas do mestre
  
  status: 'alive' | 'injured' | 'mia' | 'kia' | 'disappeared'
  
  createdAt: Date
  updatedAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

### 5. Ameaça/Monstro (Threat)

```typescript
interface Threat {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  masterId: string              // FK para User (criador)
  
  name: string                  // Nome da ameaça
  code: string                  // Código de classificação (ex: AM-TWR-2024-KETER-3)
  type: 'creature' | 'entity' | 'anomaly' | 'artifact' | 'other'
  originPlane?: string          // Origem planar (opcional)
  
  description: string           // Descrição física/comportamental
  capabilities: string[]        // Lista de capacidades
  weaknesses: string[]          // Lista de fraquezas
  
  // Estatísticas de combate
  combatStats: {
    pv: number
    pvMax: number
    defense: number
    attacks: Array<{
      name: string
      damage: string
      type: string
      description?: string
    }>
  }
  
  // Classificação
  containmentLevel: 'safe' | 'eucalipto' | 'keter' | 'apollyon'
  dangerLevel: 'low' | 'medium' | 'high' | 'critical'
  
  // Status e localização
  status: 'contained' | 'supervised' | 'to_capture' | 'eliminated'
  location?: string             // Localização atual
  containmentProcedures?: string // Procedimentos de contenção
  
  // Histórico
  discoveryDate?: Date          // Data de descoberta
  incidents: Array<{           // Incidentes relacionados
    date: Date
    description: string
  }>
  
  // Relações
  relatedMissions?: string[]    // IDs de missões relacionadas
  relatedCharacters?: string[]  // IDs de personagens que interagiram
  
  notes: string                // Notas do mestre
  
  createdAt: Date
  updatedAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

### 6. Relatório (Report)

```typescript
interface Report {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  masterId: string              // FK para User (criador)
  
  title: string                 // Título do relatório
  content: string               // Conteúdo (markdown suportado)
  type: 'mission' | 'session' | 'general' | 'character' | 'threat'
  
  date: Date                    // Data do evento relatado
  tags: string[]                // Tags para organização
  
  // Metadados
  isPrivate: boolean            // Se é privado (apenas mestre vê)
  sharedWith: string[]          // IDs de usuários com acesso (se não privado)
  
  createdAt: Date
  updatedAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

### 7. Convocações (Summon)

```typescript
interface Summon {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  masterId: string              // FK para User (criador)
  
  title: string                 // Título da convocação
  message: string               // Mensagem/descrição
  scheduledDate: Date           // Data/hora agendada
  
  // Participantes
  invitedPlayers: string[]      // IDs dos jogadores convidados
  confirmedPlayers: string[]    // IDs dos jogadores que confirmaram
  declinedPlayers: string[]     // IDs dos jogadores que recusaram
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  
  // Notificações
  reminderSent: boolean        // Se lembrete foi enviado
  reminderDate?: Date          // Data do lembrete
  
  createdAt: Date
  updatedAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

### 8. Documentação (Document)

```typescript
interface Document {
  id: string                    // UUID v4
  campaignId: string            // FK para Campaign
  masterId: string              // FK para User (criador)
  
  title: string                 // Título do documento
  content: string               // Conteúdo (markdown suportado)
  category: string              // Categoria (ex: 'lore', 'rules', 'notes')
  
  // Acesso
  isPrivate: boolean            // Se é privado (apenas mestre)
  sharedWith: string[]          // IDs de usuários com acesso
  
  tags: string[]                // Tags para organização
  
  createdAt: Date
  updatedAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

### 9. Evento de Campanha (CampaignEvent)

```typescript
interface CampaignEvent {
  id: string                    // UUID v4
  campaignId: string           // FK para Campaign
  masterId: string             // FK para User (criador)
  
  title: string                 // Título do evento
  description: string           // Descrição
  type: 'mission' | 'discovery' | 'death' | 'achievement' | 'other'
  
  date: Date                    // Data do evento (na timeline da campanha)
  
  // Relações
  relatedCharacters?: string[]  // IDs de personagens envolvidos
  relatedThreats?: string[]    // IDs de ameaças envolvidas
  relatedNPCs?: string[]       // IDs de NPCs envolvidos
  
  createdAt: Date
  
  // Relações
  campaign: Campaign
  master: User
}
```

---

## 🎭 Mocks Provisórios

Os mocks provisórios devem ser implementados como **arquivos JSON** ou **arrays TypeScript** que simulam o banco de dados. Eles devem seguir **exatamente** a estrutura de dados definida acima para facilitar a migração posterior.

### Estrutura de Mocks

Criar arquivos separados para cada entidade:

```
frontend/src/mocks/
├── users.mock.ts
├── campaigns.mock.ts
├── characters.mock.ts
├── npcs.mock.ts
├── threats.mock.ts
├── reports.mock.ts
├── summons.mock.ts
├── documents.mock.ts
└── events.mock.ts
```

### Implementação dos Mocks

#### 1. users.mock.ts

```typescript
import { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'master@tower.com',
    password: '$2b$10$hashedpassword', // Hash bcrypt de 'senha123'
    name: 'Mestre Silva',
    role: 'master',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-01-20')
  },
  {
    id: 'user-002',
    email: 'player1@tower.com',
    password: '$2b$10$hashedpassword',
    name: 'Jogador Um',
    role: 'player',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    lastLoginAt: new Date('2024-01-20')
  },
  {
    id: 'user-003',
    email: 'player2@tower.com',
    password: '$2b$10$hashedpassword',
    name: 'Jogador Dois',
    role: 'player',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    lastLoginAt: new Date('2024-01-19')
  }
]

// Função helper para buscar usuário por ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

// Função helper para buscar usuário por email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

// Função helper para autenticar (simular login)
export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email)
  // Em produção, comparar hash bcrypt
  // Por enquanto, aceitar qualquer senha para mocks
  return user || null
}
```

#### 2. campaigns.mock.ts

```typescript
import { Campaign } from '../types'

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Operação Eclipse',
    description: 'Uma campanha sobre contenção de ameaças planares em São Paulo.',
    masterId: 'user-001',
    status: 'active',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    startedAt: new Date('2024-01-18')
  },
  {
    id: 'campaign-002',
    name: 'Torre de Vigilância',
    description: 'Campanha focada em investigações e descobertas sobre a estrutura dos planos.',
    masterId: 'user-001',
    status: 'paused',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    startedAt: new Date('2024-01-10')
  }
]

export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id)
}

export const getCampaignsByMaster = (masterId: string): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.masterId === masterId)
}

export const getCampaignsByPlayer = (playerId: string): Campaign[] => {
  // Em produção, buscaria pela relação players
  // Por enquanto, retornar todas as campanhas ativas
  return mockCampaigns.filter(campaign => campaign.status === 'active')
}
```

#### 3. characters.mock.ts

```typescript
import { Character } from '../types'

export const mockCharacters: Character[] = [
  {
    id: 'char-001',
    campaignId: 'campaign-001',
    playerId: 'user-002',
    
    // Informações básicas
    name: 'Marcus Coleman',
    concept: 'Investigador Implacável',
    origin: 'Detetive de polícia que investigou crime sobrenatural',
    age: 38,
    appearance: 'Homem de 38 anos, cicatriz no rosto, olhos cinzentos, sempre veste preto',
    code: 'TWR-AG-2024-8472',
    rank: 'Agente',
    division: 'DIC',
    status: 'active',
    
    // Atributos
    attributes: {
      forca: 3,
      destreza: 3,
      constituicao: 3,
      inteligencia: 4,
      sabedoria: 5,
      carisma: 4,
      poder: 2
    },
    
    // Status derivados (calculados)
    statusDerived: {
      pv: 15,
      pvMax: 15,
      ps: 30,
      psMax: 30,
      pe: 10,
      peMax: 10,
      defense: 3,
      initiative: 3
    },
    
    // Perícias
    skills: [
      {
        id: 'skill-001',
        name: 'Investigação',
        attribute: 'inteligencia',
        level: 5,
        specializations: [
          {
            id: 'spec-001',
            name: 'Análise de Cenas de Crime',
            level: 1
          }
        ]
      },
      {
        id: 'skill-002',
        name: 'Percepção',
        attribute: 'sabedoria',
        level: 2
      },
      {
        id: 'skill-003',
        name: 'Persuasão',
        attribute: 'carisma',
        level: 1
      }
    ],
    
    // Vantagens
    advantages: [
      {
        id: 'adv-001',
        name: 'Mente Forte',
        description: 'Vontade de ferro, resistência a controle mental',
        cost: 3,
        mechanicalEffect: '+5 PS, resistência a controle mental'
      }
    ],
    
    // Desvantagens
    disadvantages: [],
    
    // Rótulos
    labels: {
      power: 'Investigador Implacável',
      weakness: 'Obsessivo até Autodestruição'
    },
    
    // Plano Interior
    innerPlane: {
      name: 'Paz Interior',
      type: 'fruit',
      description: 'Naturalmente calmo, consegue esperar horas, reage lentamente mas bem'
    },
    
    // Seeds e Poderes
    seeds: [],
    powerThemes: [],
    powerCards: [],
    
    // Equipamentos
    equipment: [
      {
        id: 'eq-001',
        name: 'Pistola 9mm Padrão Tower',
        type: 'weapon',
        description: 'Arma padrão da Tower',
        properties: {
          damage: '1d10+2',
          range: 'médio'
        },
        equipped: true
      },
      {
        id: 'eq-002',
        name: 'Terno Preto Discreto',
        type: 'armor',
        description: 'Roupa tática para investigações',
        properties: {
          defense: 1
        },
        equipped: true
      }
    ],
    
    // Histórico
    history: 'Detetive de polícia que investigou crime sobrenatural. Viu algo que não podia ser explicado. Tower o recrutou e o treinou. Agora busca proteger inocentes enquanto luta contra o medo de enlouquecer.',
    
    relationships: [
      {
        id: 'rel-001',
        type: 'mentor',
        name: 'Agente Veterano',
        description: 'Agente veterano que me recrutou e ensinou os fundamentos'
      }
    ],
    
    // Metadados
    xp: 0,
    xpTotal: 0,
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user-002',
    lastModifiedBy: 'user-002'
  }
]

export const getCharacterById = (id: string): Character | undefined => {
  return mockCharacters.find(char => char.id === id)
}

export const getCharactersByCampaign = (campaignId: string): Character[] => {
  return mockCharacters.filter(char => char.campaignId === campaignId)
}

export const getCharactersByPlayer = (playerId: string): Character[] => {
  return mockCharacters.filter(char => char.playerId === playerId)
}
```

#### 4. npcs.mock.ts

```typescript
import { NPC } from '../types'

export const mockNPCs: NPC[] = [
  {
    id: 'npc-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    name: 'Dr. Elena Vasquez',
    description: 'Cientista da Tower especializada em Seeds e anomalias planares. Mulher de 45 anos, cabelos grisalhos, sempre usa jaleco branco.',
    affiliation: 'Tower - Divisão de Pesquisa',
    rank: 'Diretora de Pesquisa',
    age: 45,
    
    attributes: {
      inteligencia: 8,
      sabedoria: 6,
      carisma: 4,
      poder: 7
    },
    
    skills: [
      { name: 'Ocultismo', level: 5 },
      { name: 'Ciência', level: 5 },
      { name: 'Investigação', level: 3 }
    ],
    
    relationships: [],
    history: 'Apareceu em várias missões de investigação, sempre fornecendo informações cruciais sobre Seeds e planos.',
    notes: 'NPC importante para progressão da campanha. Pode fornecer Seeds aos jogadores.',
    
    status: 'alive',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getNPCById = (id: string): NPC | undefined => {
  return mockNPCs.find(npc => npc.id === id)
}

export const getNPCsByCampaign = (campaignId: string): NPC[] => {
  return mockNPCs.filter(npc => npc.campaignId === campaignId)
}
```

#### 5. threats.mock.ts

```typescript
import { Threat } from '../types'

export const mockThreats: Threat[] = [
  {
    id: 'threat-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    name: 'Sussurro das Sombras',
    code: 'AM-TWR-2024-KETER-3',
    type: 'entity',
    originPlane: 'Plano da Discórdia',
    
    description: 'Entidade incorpórea que se manifesta como sombras que sussurram segredos. Pode possuir pessoas através de seus medos.',
    capabilities: [
      'Possessão através de medos',
      'Manipulação de sombras',
      'Leitura de pensamentos',
      'Invisibilidade em áreas escuras'
    ],
    weaknesses: [
      'Luz intensa causa dano',
      'Símbolos sagrados causam dor',
      'Vulnerável a ataques de energia positiva'
    ],
    
    combatStats: {
      pv: 50,
      pvMax: 50,
      defense: 8,
      attacks: [
        {
          name: 'Sussurro Corrompedor',
          damage: '2d10+5',
          type: 'simbólico',
          description: 'Ataque que causa dano PS'
        },
        {
          name: 'Possessão',
          damage: '1d10',
          type: 'controle',
          description: 'Tenta possuir alvo'
        }
      ]
    },
    
    containmentLevel: 'keter',
    dangerLevel: 'high',
    status: 'to_capture',
    location: 'Centro de São Paulo - Edifício Abandonado',
    containmentProcedures: 'Manter em área iluminada constantemente. Usar símbolos sagrados ao redor. Monitoramento psíquico constante.',
    
    discoveryDate: new Date('2024-01-15'),
    incidents: [
      {
        date: new Date('2024-01-15'),
        description: 'Primeira aparição registrada. Três vítimas possuídas.'
      }
    ],
    
    relatedMissions: [],
    relatedCharacters: [],
    notes: 'Ameaça prioritária. Objetivo da Operação Eclipse.',
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getThreatById = (id: string): Threat | undefined => {
  return mockThreats.find(threat => threat.id === id)
}

export const getThreatsByCampaign = (campaignId: string): Threat[] => {
  return mockThreats.filter(threat => threat.campaignId === campaignId)
}
```

#### 6. reports.mock.ts

```typescript
import { Report } from '../types'

export const mockReports: Report[] = [
  {
    id: 'report-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Relatório da Sessão 1 - Operação Eclipse',
    content: `# Relatório da Sessão 1

## Resumo
Os agentes iniciaram a investigação sobre o "Sussurro das Sombras" no centro de São Paulo.

## Eventos Principais
- Investigação do edifício abandonado
- Encontro com entidade
- Fuga bem-sucedida

## Próximos Passos
- Continuar investigação
- Buscar informações sobre origem planar`,
    
    type: 'session',
    date: new Date('2024-01-20'),
    tags: ['sessão', 'investigação', 'ameaça'],
    
    isPrivate: false,
    sharedWith: ['user-002', 'user-003'],
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id)
}

export const getReportsByCampaign = (campaignId: string): Report[] => {
  return mockReports.filter(report => report.campaignId === campaignId)
}
```

#### 7. summons.mock.ts

```typescript
import { Summon } from '../types'

export const mockSummons: Summon[] = [
  {
    id: 'summon-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Sessão 2 - Operação Eclipse',
    message: 'Próxima sessão agendada para continuar a investigação do Sussurro das Sombras.',
    scheduledDate: new Date('2024-01-27T19:00:00'),
    
    invitedPlayers: ['user-002', 'user-003'],
    confirmedPlayers: ['user-002'],
    declinedPlayers: [],
    
    status: 'pending',
    reminderSent: false,
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getSummonById = (id: string): Summon | undefined => {
  return mockSummons.find(summon => summon.id === id)
}

export const getSummonsByCampaign = (campaignId: string): Summon[] => {
  return mockSummons.filter(summon => summon.campaignId === campaignId)
}
```

#### 8. documents.mock.ts

```typescript
import { Document } from '../types'

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Lore da Campanha - Divisões da Tower',
    content: `# Divisões da Tower

A Tower possui cinco divisões principais:

1. **DIC** - Divisão de Investigação e Contenção
2. **DOE** - Divisão de Operações Especiais
3. **DIP** - Divisão de Inteligência e Planejamento
4. **DAP** - Divisão de Análise e Pesquisa
5. **DAS** - Divisão de Apoio e Suporte`,
    
    category: 'lore',
    isPrivate: false,
    sharedWith: ['user-002', 'user-003'],
    tags: ['lore', 'tower', 'divisões'],
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
]

export const getDocumentById = (id: string): Document | undefined => {
  return mockDocuments.find(doc => doc.id === doc.id)
}

export const getDocumentsByCampaign = (campaignId: string): Document[] => {
  return mockDocuments.filter(doc => doc.campaignId === campaignId)
}
```

#### 9. events.mock.ts

```typescript
import { CampaignEvent } from '../types'

export const mockEvents: CampaignEvent[] = [
  {
    id: 'event-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Descoberta do Sussurro das Sombras',
    description: 'Os agentes descobriram a existência da entidade conhecida como Sussurro das Sombras.',
    type: 'discovery',
    date: new Date('2024-01-20'),
    
    relatedCharacters: ['char-001'],
    relatedThreats: ['threat-001'],
    relatedNPCs: [],
    
    createdAt: new Date('2024-01-20')
  }
]

export const getEventById = (id: string): CampaignEvent | undefined => {
  return mockEvents.find(event => event.id === id)
}

export const getEventsByCampaign = (campaignId: string): CampaignEvent[] => {
  return mockEvents.filter(event => event.campaignId === campaignId)
}
```

### Serviço de Mock API

Criar um serviço que simula chamadas de API usando os mocks:

```typescript
// frontend/src/services/mockApi.ts

import { 
  mockUsers, getUserById, getUserByEmail, authenticateUser,
  mockCampaigns, getCampaignById, getCampaignsByMaster, getCampaignsByPlayer,
  mockCharacters, getCharacterById, getCharactersByCampaign, getCharactersByPlayer,
  mockNPCs, getNPCById, getNPCsByCampaign,
  mockThreats, getThreatById, getThreatsByCampaign,
  mockReports, getReportById, getReportsByCampaign,
  mockSummons, getSummonById, getSummonsByCampaign,
  mockDocuments, getDocumentById, getDocumentsByCampaign,
  mockEvents, getEventById, getEventsByCampaign
} from '../mocks'

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  // Auth
  async login(email: string, password: string) {
    await delay(500)
    const user = authenticateUser(email, password)
    if (!user) throw new Error('Credenciais inválidas')
    return { user, token: `mock-token-${user.id}` }
  },
  
  // Campaigns
  async getCampaigns(userId: string, role: 'player' | 'master') {
    await delay(300)
    if (role === 'master') {
      return getCampaignsByMaster(userId)
    }
    return getCampaignsByPlayer(userId)
  },
  
  async getCampaign(id: string) {
    await delay(200)
    return getCampaignById(id)
  },
  
  // Characters
  async getCharacters(campaignId?: string, playerId?: string) {
    await delay(300)
    if (campaignId) return getCharactersByCampaign(campaignId)
    if (playerId) return getCharactersByPlayer(playerId)
    return mockCharacters
  },
  
  async getCharacter(id: string) {
    await delay(200)
    return getCharacterById(id)
  },
  
  async createCharacter(data: Partial<Character>) {
    await delay(500)
    const newChar = {
      id: `char-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Character
    mockCharacters.push(newChar)
    return newChar
  },
  
  async updateCharacter(id: string, data: Partial<Character>) {
    await delay(400)
    const index = mockCharacters.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Personagem não encontrado')
    mockCharacters[index] = { ...mockCharacters[index], ...data, updatedAt: new Date() }
    return mockCharacters[index]
  },
  
  // NPCs
  async getNPCs(campaignId: string) {
    await delay(300)
    return getNPCsByCampaign(campaignId)
  },
  
  // Threats
  async getThreats(campaignId: string) {
    await delay(300)
    return getThreatsByCampaign(campaignId)
  },
  
  // Reports
  async getReports(campaignId: string) {
    await delay(300)
    return getReportsByCampaign(campaignId)
  },
  
  // Summons
  async getSummons(campaignId: string) {
    await delay(300)
    return getSummonsByCampaign(campaignId)
  },
  
  // Documents
  async getDocuments(campaignId: string) {
    await delay(300)
    return getDocumentsByCampaign(campaignId)
  },
  
  // Events
  async getEvents(campaignId: string) {
    await delay(300)
    return getEventsByCampaign(campaignId)
  }
}
```

---

## 🔒 Regras de Negócio

### Autenticação e Autorização

1. **Login:**
   - Email e senha obrigatórios
   - Senha deve ter mínimo 8 caracteres
   - Retornar token JWT válido por 24h

2. **Autorização:**
   - Jogador só pode editar suas próprias fichas
   - Mestre pode ver e editar todas as fichas da campanha
   - Mestre pode criar/editar NPCs, ameaças, relatórios, convocações, documentações
   - Jogador só pode ver conteúdo compartilhado com ele

### Validação de Fichas

1. **Atributos:**
   - Todos os atributos devem estar entre 1 e 10
   - Na criação, soma total deve seguir sistema escalonado (máximo 30 pontos)
   - Sistema escalonado:
     - Níveis 1-3: 1 ponto cada
     - Níveis 4-6: 2 pontos cada
     - Níveis 7-9: 3 pontos cada
     - Nível 10: 4 pontos

2. **Status Derivados:**
   - Calculados automaticamente
   - PV = Constituição × 5 + bônus de armadura
   - PS = Sabedoria × 5 + bônus de vantagens
   - PE = Poder × 5 + bônus de Seeds

3. **Perícias:**
   - Nível entre 0-5
   - Especializações nível entre 1-3
   - Máximo 2 especializações por perícia

### Campanhas

1. **Criação:**
   - Apenas usuários com role 'master' podem criar
   - Nome obrigatório, mínimo 3 caracteres
   - Status inicial: 'active'

2. **Convites:**
   - Mestre pode convidar jogadores por email
   - Jogador recebe notificação
   - Jogador pode aceitar ou recusar

### Convocações

1. **Criação:**
   - Apenas mestre pode criar
   - Data agendada obrigatória
   - Deve convidar pelo menos 1 jogador

2. **Confirmação:**
   - Jogador pode confirmar ou recusar
   - Status atualiza automaticamente

---

## ✅ Validações

### Frontend (Zod Schemas)

```typescript
import { z } from 'zod'

export const characterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  concept: z.string().min(3, 'Conceito deve ter no mínimo 3 caracteres'),
  origin: z.string().min(5, 'Origem deve ter no mínimo 5 caracteres'),
  age: z.number().min(18).max(100),
  
  attributes: z.object({
    forca: z.number().min(1).max(10),
    destreza: z.number().min(1).max(10),
    constituicao: z.number().min(1).max(10),
    inteligencia: z.number().min(1).max(10),
    sabedoria: z.number().min(1).max(10),
    carisma: z.number().min(1).max(10),
    poder: z.number().min(1).max(10)
  }).refine((attrs) => {
    // Validar sistema escalonado (máximo 30 pontos)
    const total = calculateAttributeCost(attrs)
    return total <= 30
  }, 'Total de pontos de atributos não pode exceder 30'),
  
  skills: z.array(z.object({
    name: z.string(),
    attribute: z.string(),
    level: z.number().min(0).max(5)
  })),
  
  labels: z.object({
    power: z.string().min(3),
    weakness: z.string().min(3)
  })
})
```

### Backend (Express Validator)

```typescript
import { body, validationResult } from 'express-validator'

export const validateCharacter = [
  body('name').isLength({ min: 2 }).trim(),
  body('attributes.forca').isInt({ min: 1, max: 10 }),
  // ... outros campos
]
```

---

## 🔌 APIs e Endpoints

### Estrutura Base

```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   └── POST /logout
├── campaigns/
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── characters/
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── npcs/
│   ├── GET /
│   ├── POST /
│   └── PUT /:id
├── threats/
│   ├── GET /
│   ├── POST /
│   └── PUT /:id
├── reports/
│   ├── GET /
│   ├── POST /
│   └── PUT /:id
├── summons/
│   ├── GET /
│   ├── POST /
│   └── PUT /:id
└── documents/
    ├── GET /
    ├── POST /
    └── PUT /:id
```

### Exemplo de Endpoint

```typescript
// GET /api/v1/characters/:id
export const getCharacter = async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user.id
  const userRole = req.user.role
  
  const character = await prisma.character.findUnique({
    where: { id },
    include: { campaign: true, player: true }
  })
  
  if (!character) {
    return res.status(404).json({ error: 'Personagem não encontrado' })
  }
  
  // Verificar permissão
  if (userRole === 'player' && character.playerId !== userId) {
    return res.status(403).json({ error: 'Sem permissão' })
  }
  
  res.json(character)
}
```

---

## 📝 Notas de Implementação

### Migração de Mocks para Banco de Dados

1. **Fase 1 - Mocks:**
   - Implementar toda a lógica com mocks
   - Testar fluxos completos
   - Validar estrutura de dados

2. **Fase 2 - Schema Prisma:**
   - Criar schema.prisma baseado nas interfaces TypeScript
   - Gerar migrations
   - Popular banco com dados dos mocks

3. **Fase 3 - Substituição:**
   - Criar serviços de API reais
   - Substituir chamadas mockApi por chamadas reais
   - Manter mesma interface de serviço

### Estrutura de Serviços

```typescript
// frontend/src/services/api.ts

// Em desenvolvimento: usar mockApi
// Em produção: usar api real

const isDevelopment = import.meta.env.DEV

export const api = isDevelopment ? mockApi : realApi
```

---

## 🎨 Tema Visual

### Cores

```css
:root {
  --neon-green: #00FF41;
  --neon-green-dark: #00CC33;
  --neon-green-light: #33FF66;
  --black: #000000;
  --black-light: #0A0A0A;
  --black-lighter: #1A1A1A;
  --gray-dark: #333333;
  --gray-medium: #666666;
  --text-primary: #FFFFFF;
  --text-secondary: #CCCCCC;
  --text-muted: #999999;
  
  /* Efeitos */
  --glow-green: 0 0 10px rgba(0, 255, 65, 0.5);
  --glow-green-strong: 0 0 20px rgba(0, 255, 65, 0.8);
}
```

### Componentes Base

- **Botões:** Borda neon verde, fundo preto, glow no hover
- **Inputs:** Borda neon verde, fundo preto escuro, texto branco
- **Cards:** Fundo preto, borda neon verde, sombra glow
- **Modais:** Fundo preto semi-transparente, card central com borda neon
- **Tabelas:** Linhas alternadas pretas/escuras, borda neon verde

---

## 🚀 Próximos Passos

1. Implementar estrutura base do projeto
2. Criar mocks provisórios
3. Implementar autenticação (mock)
4. Criar layout base com tema visual
5. Implementar área do jogador
6. Implementar área do mestre
7. Migrar para banco de dados real

---

> _"Cada linha de código é um passo em direção à Tower Digital. Cada commit é uma operação concluída."_

