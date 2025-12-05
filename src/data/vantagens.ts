import { AdvantageDefinition } from '../types'

export const vantagens: AdvantageDefinition[] = [
  // Vantagens de Combate
  {
    id: 'reflexos-aguçados',
    name: 'Reflexos Aguçados',
    description: 'Você sempre reage primeiro em situações de perigo',
    cost: 3,
    category: 'combate',
    mechanicalEffect: '+2 em iniciativa'
  },
  {
    id: 'luta-aprimorada',
    name: 'Luta Aprimorada',
    description: 'Treinamento em artes marciais avançadas',
    cost: 2,
    category: 'combate',
    mechanicalEffect: '+1 em combate corpo a corpo'
  },
  {
    id: 'tiro-certeiro',
    name: 'Tiro Certeiro',
    description: 'Precisão sobre-humana com armas à distância',
    cost: 3,
    category: 'combate',
    mechanicalEffect: '+2 em tiros críticos'
  },
  
  // Vantagens Sociais
  {
    id: 'presenca-carismatica',
    name: 'Presença Carismática',
    description: 'Pessoas gostam naturalmente de você',
    cost: 2,
    category: 'social',
    mechanicalEffect: '+2 em Persuasão'
  },
  {
    id: 'mentor-influente',
    name: 'Mentor Influente',
    description: 'Conhece pessoas importantes e tem acesso a recursos',
    cost: 3,
    category: 'social',
    mechanicalEffect: '+1 em contatos, acesso a recursos'
  },
  
  // Vantagens Mentais
  {
    id: 'mente-forte',
    name: 'Mente Forte',
    description: 'Vontade de ferro, resistência a controle mental',
    cost: 3,
    category: 'mental',
    mechanicalEffect: '+5 PS, resistência a controle mental'
  },
  {
    id: 'inteligencia-brilhante',
    name: 'Inteligência Brilhante',
    description: 'Capacidade mental excepcional',
    cost: 2,
    category: 'mental',
    mechanicalEffect: '+2 em testes de INT'
  },
  {
    id: 'vontade-inquebravel',
    name: 'Vontade Inquebrável',
    description: 'Sobrevivente de colapso simbólico',
    cost: 3,
    category: 'mental',
    mechanicalEffect: 'Rola 2 dados em testes de PS, escolhe o melhor'
  },
  
  // Vantagens Sobrenaturais
  {
    id: 'resistencia-planar',
    name: 'Resistência Planar',
    description: 'Seu corpo rejeita energia planar',
    cost: 3,
    category: 'sobrenatural',
    mechanicalEffect: '+2 em resistência contra magia'
  },
  {
    id: 'conexao-espiritual',
    name: 'Conexão Espiritual',
    description: 'Naturalmente conectado aos planos',
    cost: 2,
    category: 'sobrenatural',
    mechanicalEffect: '+1 em PE inicial, sente presença espiritual'
  },
  {
    id: 'visao-onirica',
    name: 'Visão Onírica',
    description: 'Pode ver em sonhos locais e entidades reais',
    cost: 3,
    category: 'sobrenatural',
    mechanicalEffect: 'Fragmento de Arcadia - visão em sonhos'
  },
  {
    id: 'portador-de-runas',
    name: 'Portador de Runas',
    description: 'Pode ativar artefatos mesmo sem treinamento',
    cost: 2,
    category: 'sobrenatural',
    mechanicalEffect: 'Implante ou marca deixada por Seed'
  },
  {
    id: 'sussurros-do-vento',
    name: 'Sussurros do Vento',
    description: 'Ouve frases proféticas em locais altos',
    cost: 2,
    category: 'sobrenatural',
    mechanicalEffect: '+1 em testes de previsão'
  },
  {
    id: 'conexao-ancestral',
    name: 'Conexão Ancestral',
    description: 'Sangue planar herdado',
    cost: 2,
    category: 'sobrenatural',
    mechanicalEffect: '+1 em testes de Sabedoria em locais esquecidos'
  },
  {
    id: 'armadura-oculta',
    name: 'Armadura Oculta',
    description: 'Treinamento com DIC ou DOE',
    cost: 2,
    category: 'sobrenatural',
    mechanicalEffect: '+1 de defesa contra ataque mágico invisível'
  },
  
  // Vantagem Especial: Mestre
  {
    id: 'mestre',
    name: 'Mestre',
    description: 'Maestria absoluta em uma perícia específica. Requer Perícia 5 e Especialização 2',
    cost: 15,
    category: 'combate',
    mechanicalEffect: 'Crítico ocorre com 9 OU 10 (ao invés de apenas 10)'
  }
]

