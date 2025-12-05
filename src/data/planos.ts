import { PlaneDefinition } from '../types'

export const planos: PlaneDefinition[] = [
  // Planos Elementais (Nível -3 a -1)
  {
    id: 'agua',
    name: 'Plano da Água',
    level: -2,
    category: 'elemental',
    description: 'Emoção fluida, ressonância viva'
  },
  {
    id: 'terra',
    name: 'Plano da Terra',
    level: -2,
    category: 'elemental',
    description: 'Estabilidade absoluta, gravidade simbólica'
  },
  {
    id: 'ar',
    name: 'Plano do Ar',
    level: -2,
    category: 'elemental',
    description: 'Movimento leve, invisível, impreciso'
  },
  {
    id: 'fogo',
    name: 'Plano do Fogo',
    level: -2,
    category: 'elemental',
    description: 'Chamas, queimadura, paixão'
  },
  {
    id: 'eter',
    name: 'Plano do Éter',
    level: -2,
    category: 'elemental',
    description: 'Luz lunar, ciclos, presciência'
  },
  {
    id: 'plantas',
    name: 'Plano das Plantas',
    level: -1,
    category: 'elemental',
    description: 'Vegetação, crescimento'
  },
  {
    id: 'animais',
    name: 'Plano dos Animais',
    level: -1,
    category: 'elemental',
    description: 'Formas animais, instinto'
  },
  
  // Planos Espelhos (Nível 1)
  {
    id: 'medo',
    name: 'Plano do Medo',
    level: 1,
    category: 'espelho',
    description: 'Fobias, terror, trevas'
  },
  {
    id: 'desejo',
    name: 'Plano do Desejo',
    level: 1,
    category: 'espelho',
    description: 'Tentações, desejos, manifestação de fantasias'
  },
  
  // Planos Interiores (Nível 2) - Frutos
  {
    id: 'amor',
    name: 'Plano do Amor',
    level: 2,
    category: 'interior',
    description: 'Afeto, compaixão, conexão'
  },
  {
    id: 'alegria',
    name: 'Plano da Alegria',
    level: 2,
    category: 'interior',
    description: 'Felicidade, energia positiva'
  },
  {
    id: 'paz',
    name: 'Plano da Paz',
    level: 2,
    category: 'interior',
    description: 'Harmonia, calma, estabilidade emocional'
  },
  {
    id: 'paciencia',
    name: 'Plano da Paciência',
    level: 2,
    category: 'interior',
    description: 'Calma, espera, controle'
  },
  {
    id: 'amabilidade',
    name: 'Plano da Amabilidade',
    level: 2,
    category: 'interior',
    description: 'Gentileza, bondade, compaixão'
  },
  {
    id: 'bondade',
    name: 'Plano da Bondade',
    level: 2,
    category: 'interior',
    description: 'Benevolência, altruísmo'
  },
  {
    id: 'fidelidade',
    name: 'Plano da Fidelidade',
    level: 2,
    category: 'interior',
    description: 'Lealdade, compromisso'
  },
  {
    id: 'mansidao',
    name: 'Plano da Mansidão',
    level: 2,
    category: 'interior',
    description: 'Humildade, suavidade'
  },
  {
    id: 'dominio-proprio',
    name: 'Plano do Domínio Próprio',
    level: 2,
    category: 'interior',
    description: 'Autocontrole, disciplina'
  },
  
  // Planos Interiores (Nível 2) - Obras
  {
    id: 'odio',
    name: 'Plano do Ódio',
    level: 2,
    category: 'interior',
    description: 'Rancor, isolamento, desconfiança'
  },
  {
    id: 'tristeza',
    name: 'Plano da Tristeza',
    level: 2,
    category: 'interior',
    description: 'Melancolia, desesperança'
  },
  {
    id: 'discordia',
    name: 'Plano da Discórdia',
    level: 2,
    category: 'interior',
    description: 'Conflito, desarmonia'
  },
  {
    id: 'ira',
    name: 'Plano da Ira',
    level: 2,
    category: 'interior',
    description: 'Fúria, reatividade, paixão destrutiva'
  },
  {
    id: 'crueldade',
    name: 'Plano da Crueldade',
    level: 2,
    category: 'interior',
    description: 'Malícia, indiferença ao sofrimento'
  },
  {
    id: 'maldade',
    name: 'Plano da Maldade',
    level: 2,
    category: 'interior',
    description: 'Malevolência, egoísmo extremo'
  },
  {
    id: 'traicao',
    name: 'Plano da Traição',
    level: 2,
    category: 'interior',
    description: 'Deslealdade, engano'
  },
  {
    id: 'orgulho',
    name: 'Plano do Orgulho',
    level: 2,
    category: 'interior',
    description: 'Arrogância, vaidade'
  },
  {
    id: 'libertinagem',
    name: 'Plano da Libertinagem',
    level: 2,
    category: 'interior',
    description: 'Falta de controle, excesso'
  },
  
  // Planos Exteriores (Nível 3)
  {
    id: 'caos',
    name: 'Plano do Caos',
    level: 3,
    category: 'exterior',
    description: 'Desordem aleatória, imprevisibilidade'
  },
  {
    id: 'ordem',
    name: 'Plano da Ordem',
    level: 3,
    category: 'exterior',
    description: 'Estrutura perfeita, padrões rígidos'
  },
  {
    id: 'inconsciente',
    name: 'Espiral do Inconsciente',
    level: 3,
    category: 'exterior',
    description: 'Sonhos, memórias, arquétipos primordiais'
  }
]

