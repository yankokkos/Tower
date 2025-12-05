import { DisadvantageDefinition } from '../types'

export const desvantagens: DisadvantageDefinition[] = [
  // Desvantagens Físicas
  {
    id: 'fraco-fragil',
    name: 'Fraco/Frágil',
    description: 'Corpo fraco ou enfermo',
    xpGain: 3,
    category: 'fisica',
    penalty: '-1 em Força ou Constituição'
  },
  {
    id: 'lento',
    name: 'Lento',
    description: 'Sempre por último em ações',
    xpGain: 2,
    category: 'fisica',
    penalty: '-2 em iniciativa'
  },
  {
    id: 'bronze-em-forma-de-gente',
    name: 'Bronze em Forma de Gente',
    description: 'Corpo rígido, pouco flexível',
    xpGain: 2,
    category: 'fisica',
    penalty: 'Suscetível a calor e eletricidade'
  },
  
  // Desvantagens Psicológicas
  {
    id: 'fobia',
    name: 'Fobia',
    description: 'Medo intenso e paralisante de algo específico',
    xpGain: 2,
    category: 'psicologica',
    penalty: '-2 em testes se confronta medo',
    attentionTheme: 'Subversão'
  },
  {
    id: 'culpa-existencial',
    name: 'Culpa Existencial',
    description: 'Remorso profundo por ações passadas',
    xpGain: 3,
    category: 'psicologica',
    penalty: '-1 em Carisma, risco de paralisia moral',
    attentionTheme: 'Expressividade'
  },
  {
    id: 'medo-de-espelhos',
    name: 'Medo de Espelhos',
    description: 'Após ver uma versão corrompida de si mesmo',
    xpGain: 2,
    category: 'psicologica',
    penalty: 'Penalidade em locais com reflexos',
    attentionTheme: 'Subversão'
  },
  {
    id: 'carrega-o-luto',
    name: 'Carrega o Luto',
    description: 'A dor de uma perda nunca se apagou',
    xpGain: 2,
    category: 'psicologica',
    penalty: 'Ao ver alguém ferido ou falhar em proteger',
    attentionTheme: 'Fortaleza'
  },
  {
    id: 'instabilidade-sonora',
    name: 'Instabilidade Sonora',
    description: 'Sons aleatórios ativam flashes de memória planar',
    xpGain: 2,
    category: 'psicologica',
    penalty: '-1 em testes de concentração em combate',
    attentionTheme: 'Previsão'
  },
  {
    id: 'sussurros-do-submundo',
    name: 'Sussurros do Submundo',
    description: 'Vozes o distraem em momentos de tensão',
    xpGain: 2,
    category: 'psicologica',
    penalty: 'Ao tentar manter foco ou concentração',
    attentionTheme: 'Subversão'
  },
  
  // Desvantagens Sociais
  {
    id: 'infame',
    name: 'Infame',
    description: 'Sua reputação precede você (negativamente)',
    xpGain: 2,
    category: 'social',
    penalty: '-2 em testes sociais com certos grupos',
    attentionTheme: 'Expressividade'
  },
  {
    id: 'divida',
    name: 'Dívida',
    description: 'Deve favores a alguém poderoso',
    xpGain: 2,
    category: 'social',
    penalty: 'Está em dívida com entidade perigosa',
    attentionTheme: 'Relíquia'
  },
  {
    id: 'aura-de-perda',
    name: 'Aura de Perda',
    description: 'Drena moral de aliados se falhar em ação emocional',
    xpGain: 2,
    category: 'social',
    penalty: 'Memória ativa de alguém morto no plano',
    attentionTheme: 'Expressividade'
  },
  {
    id: 'obcecado-por-justica',
    name: 'Obcecado por Justiça',
    description: 'Sempre age antes de tentar entender',
    xpGain: 2,
    category: 'social',
    penalty: 'Falha crítica em missão diplomática',
    attentionTheme: 'Fortaleza'
  },
  {
    id: 'obcecada-por-outras-feiticeiras',
    name: 'Obcecada por Outras Feiticeiras',
    description: 'Se distrai com qualquer presença semelhante',
    xpGain: 2,
    category: 'social',
    penalty: 'Ao enfrentar ou encontrar mágicas rivais',
    attentionTheme: 'Subversão'
  },
  
  // Desvantagens Sobrenaturais
  {
    id: 'maldicao-planar',
    name: 'Maldição Planar',
    description: 'Alguma coisa no universo não quer você aqui',
    xpGain: 3,
    category: 'sobrenatural',
    penalty: '-1 em PE, planos rejeitam sua presença',
    attentionTheme: 'Adaptabilidade'
  },
  {
    id: 'presenca-instavel',
    name: 'Presença Instável',
    description: 'Carga planar alta não contida',
    xpGain: 2,
    category: 'sobrenatural',
    penalty: 'Pode ser detectado mesmo em stealth mágico',
    attentionTheme: 'Subversão'
  },
  {
    id: 'marcado-por-sheol',
    name: 'Marcado por Sheol',
    description: 'Sobreviveu a julgamento em plano externo',
    xpGain: 2,
    category: 'sobrenatural',
    penalty: 'Sofre +1 de dano simbólico contra ataques judiciais',
    attentionTheme: 'Fortaleza'
  }
]

