import { WeaponDefinition } from '../types'

export const armas: WeaponDefinition[] = [
  // Armas Corpo a Corpo - Uma Mão
  {
    id: 'punho',
    name: 'Punho',
    damage: '1d4',
    speed: 'rapida',
    special: ['sempre-disponivel'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'adaga',
    name: 'Adaga',
    damage: '1d6',
    speed: 'rapida',
    special: ['discreta', 'rapida'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'espada-curta',
    name: 'Espada Curta',
    damage: '1d8',
    speed: 'normal',
    special: ['balanceada', 'versatil'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'machado',
    name: 'Machado',
    damage: '1d10',
    speed: 'normal',
    special: ['pesado'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'taco',
    name: 'Taco',
    damage: '1d8',
    speed: 'normal',
    special: ['contundente', 'simples'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'corrente',
    name: 'Corrente',
    damage: '1d8',
    speed: 'normal',
    special: ['alcance', 'flexivel'],
    category: 'corpo-a-corpo'
  },
  
  // Armas Corpo a Corpo - Duas Mãos
  {
    id: 'espada-longa',
    name: 'Espada Longa',
    damage: '1d10',
    speed: 'normal',
    special: ['classica', 'versatil'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'machado-grande',
    name: 'Machado Grande',
    damage: '1d12',
    speed: 'lenta',
    special: ['muito-pesado', 'muito-dano'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'lanca',
    name: 'Lança',
    damage: '1d10',
    range: '3m',
    speed: 'normal',
    special: ['alcance-medio', 'otimo-em-grupo'],
    category: 'corpo-a-corpo'
  },
  {
    id: 'cajado',
    name: 'Cajado',
    damage: '1d8',
    speed: 'normal',
    special: ['magico', 'suporta-cartas'],
    category: 'arcana'
  },
  
  // Armas à Distância
  {
    id: 'arco',
    name: 'Arco',
    damage: '1d8',
    range: '50m',
    speed: 'lenta',
    special: ['silencioso', 'municao-limitada'],
    category: 'distancia'
  },
  {
    id: 'besta',
    name: 'Besta',
    damage: '1d10',
    range: '60m',
    speed: 'lenta',
    special: ['mais-dano', 'recarga-lenta'],
    category: 'distancia'
  },
  {
    id: 'pistola',
    name: 'Pistola',
    damage: '1d10',
    range: '20m',
    speed: 'normal',
    special: ['moderno', 'municao-limitada'],
    category: 'distancia'
  },
  {
    id: 'rifle',
    name: 'Rifle',
    damage: '2d8',
    range: '100m',
    speed: 'lenta',
    special: ['muito-alcance', 'municao-limitada'],
    category: 'distancia'
  },
  {
    id: 'lancador',
    name: 'Lançador',
    damage: '1d12',
    range: '50m',
    speed: 'lenta',
    special: ['area', 'municao-muito-limitada'],
    category: 'distancia'
  },
  
  // Armas Arcanas
  {
    id: 'bastao-magico',
    name: 'Bastão Mágico',
    damage: '1d8 + POD',
    speed: 'normal',
    special: ['canaliza-magia', 'reduz-dificuldade-magia'],
    category: 'arcana'
  },
  {
    id: 'varita',
    name: 'Varita',
    damage: '1d6 + POD',
    speed: 'rapida',
    special: ['pequena', 'versatil', 'bonus-pe'],
    category: 'arcana'
  },
  {
    id: 'espada-runica',
    name: 'Espada Rúnica',
    damage: '1d10 + POD',
    speed: 'normal',
    special: ['arma-magia', 'bonus-critico'],
    category: 'arcana'
  },
  {
    id: 'adaga-de-alma',
    name: 'Adaga de Alma',
    damage: '1d6 + POD',
    speed: 'rapida',
    special: ['afeta-planos', 'ignora-armadura'],
    category: 'arcana'
  }
]

