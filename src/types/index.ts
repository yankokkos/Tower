// Types for Tower RPG System

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'player' | 'master'
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface Campaign {
  id: string
  name: string
  description: string
  masterId: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

export interface Character {
  id: string
  campaignId: string
  playerId: string
  
  // Informações básicas
  name: string
  codename?: string
  concept: string
  origin: string
  age: number
  appearance?: string
  motivation?: string
  code?: string
  rank?: string
  division?: string
  recruitmentDate?: Date
  status: 'active' | 'mission' | 'injured' | 'mia' | 'kia'
  
  // Atributos
  attributes: {
    forca: number
    destreza: number
    constituicao: number
    inteligencia: number
    sabedoria: number
    carisma: number
    poder: number
  }
  
  // Status derivados
  statusDerived: {
    pv: number
    pvMax: number
    ps: number
    psMax: number
    pe: number
    peMax: number
    defense: number
    initiative: number
  }
  
  // Perícias
  skills: Array<{
    id: string
    name: string
    attribute: string
    level: number
    specializations?: Array<{
      id: string
      name: string
      level: number
    }>
  }>
  
  // Vantagens
  advantages: Array<{
    id: string
    name: string
    description: string
    cost: number
    mechanicalEffect?: string
  }>
  
  // Desvantagens
  disadvantages: Array<{
    id: string
    name: string
    description: string
    xpGain: number
    penalty?: string
    attentionTheme?: string
  }>
  
  // Rótulos
  labels: {
    power: string
    weakness: string
  }
  
  // Plano Interior
  innerPlane: {
    name: string
    type: 'fruit' | 'work'
    description: string
  }
  
  // Seeds e Poderes
  seeds: Array<{
    id: string
    name: string
    type: 'cedida' | 'tomada' | 'despertada'
    level: 1 | 2 | 3
    originPlane: string
    description: string
    controlModifier: number // +1 para cedida, -1 para tomada, 0 para despertada
    powerModifier: number // -1 para cedida, +1 para tomada, 0 para despertada
    isActive: boolean
  }>
  
  powerThemes: Array<{
    id: string
    name: string
    description: string
    isPrimary: boolean
  }>
  
  powerCards: Array<{
    id: string
    name: string
    theme: string
    cost: number
    time: 'instantaneo' | 'turno' | 'continuo' | 'reacao' | 'ritual'
    description: string
    basicEffect: string
    advancedEffects?: Array<{
      description: string
      additionalCost?: number
      conditions?: string
    }>
    level: 1 | 2 | 3
    usageCount?: number
    maxUsage?: number
  }>
  
  // Sistema de Atenção (de desvantagens)
  attention: Record<string, number> // tema -> pontos de atenção
  
  // Equipamentos
  equipment: Array<{
    id: string
    name: string
    type: 'weapon' | 'armor' | 'tool' | 'artifact' | 'consumable' | 'other'
    description: string
    properties?: {
      // Para armas
      damage?: string // ex: "1d10+2"
      range?: string // ex: "20m"
      speed?: 'rapida' | 'normal' | 'lenta'
      special?: string[] // ex: ["discreta", "versátil"]
      // Para armaduras
      damageReduction?: number // ex: -3
      dexterityPenalty?: number // ex: -1
      // Para artefatos
      peCost?: number
      effects?: string
      // Gerais
      bonus?: number
      defense?: number
      [key: string]: any
    }
    equipped: boolean
    quantity?: number
  }>
  
  // Histórico
  history: string
  relationships: Array<{
    id: string
    type: 'mentor' | 'ally' | 'rival' | 'enemy' | 'love' | 'other'
    name: string
    description: string
    npcId?: string
  }>
  
  // Metadados
  xp: number // XP disponível para gastar
  xpTotal: number // XP total acumulado
  level?: number
  xpHistory?: Array<{
    date: Date
    amount: number
    source: string
    description: string
  }>
  
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastModifiedBy: string
}

// Tipos auxiliares para dados pré-definidos
export interface AdvantageDefinition {
  id: string
  name: string
  description: string
  cost: number // em XP
  category: 'combate' | 'social' | 'mental' | 'sobrenatural'
  mechanicalEffect: string
}

export interface DisadvantageDefinition {
  id: string
  name: string
  description: string
  xpGain: number
  category: 'fisica' | 'psicologica' | 'social' | 'sobrenatural'
  penalty?: string
  attentionTheme?: string
}

export interface WeaponDefinition {
  id: string
  name: string
  damage: string
  range?: string
  speed: 'rapida' | 'normal' | 'lenta'
  special: string[]
  category: 'corpo-a-corpo' | 'distancia' | 'arcana'
}

export interface PlaneDefinition {
  id: string
  name: string
  level: -3 | -2 | -1 | 0 | 1 | 2 | 3
  category: 'elemental' | 'interior' | 'exterior' | 'espelho'
  description: string
}

export interface PowerThemeDefinition {
  id: string
  name: string
  description: string
  effects: string[]
  affinities: string[]
}

export interface NPC {
  id: string
  campaignId: string
  masterId: string
  
  name: string
  description: string
  affiliation: string
  rank?: string
  age?: number
  appearance?: string
  
  attributes?: {
    forca?: number
    destreza?: number
    constituicao?: number
    inteligencia?: number
    sabedoria?: number
    carisma?: number
    poder?: number
  }
  
  skills?: Array<{
    name: string
    level: number
  }>
  
  relationships: Array<{
    characterId?: string
    npcId?: string
    type: string
    description: string
  }>
  
  history: string
  notes: string
  
  status: 'alive' | 'injured' | 'mia' | 'kia' | 'disappeared'
  
  createdAt: Date
  updatedAt: Date
}

export interface Threat {
  id: string
  campaignId: string
  masterId: string
  
  name: string
  code: string
  type: 'creature' | 'entity' | 'anomaly' | 'artifact' | 'other'
  originPlane?: string
  
  description: string
  capabilities: string[]
  weaknesses: string[]
  
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
  
  containmentLevel: 'safe' | 'eucalipto' | 'keter' | 'apollyon'
  dangerLevel: 'low' | 'medium' | 'high' | 'critical'
  
  status: 'contained' | 'supervised' | 'to_capture' | 'eliminated'
  location?: string
  containmentProcedures?: string
  
  discoveryDate?: Date
  incidents: Array<{
    date: Date
    description: string
  }>
  
  relatedMissions?: string[]
  relatedCharacters?: string[]
  
  notes: string
  
  createdAt: Date
  updatedAt: Date
}

export interface Report {
  id: string
  campaignId: string
  masterId: string
  
  title: string
  content: string
  type: 'mission' | 'session' | 'general' | 'character' | 'threat'
  
  date: Date
  tags: string[]
  
  isPrivate: boolean
  sharedWith: string[]
  
  createdAt: Date
  updatedAt: Date
}

export interface Summon {
  id: string
  campaignId: string
  masterId: string
  
  title: string
  message: string
  scheduledDate: Date
  
  invitedPlayers: string[]
  confirmedPlayers: string[]
  declinedPlayers: string[]
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  
  reminderSent: boolean
  reminderDate?: Date
  
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  campaignId: string
  masterId: string
  
  title: string
  content: string
  category: string
  
  isPrivate: boolean
  sharedWith: string[]
  
  tags: string[]
  
  createdAt: Date
  updatedAt: Date
}

export interface CampaignEvent {
  id: string
  campaignId: string
  masterId: string
  
  title: string
  description: string
  type: 'mission' | 'discovery' | 'death' | 'achievement' | 'other'
  
  date: Date
  
  relatedCharacters?: string[]
  relatedThreats?: string[]
  relatedNPCs?: string[]
  
  createdAt: Date
}

export interface AuthResponse {
  user: User
  token: string
}
