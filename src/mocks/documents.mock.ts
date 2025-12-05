import { Document } from '../types'

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Divisões da Tower',
    content: `# Divisões da Tower

A Tower possui cinco divisões principais, cada uma com responsabilidades específicas na proteção da realidade.

## 1. DIC - Divisão de Investigação e Contenção
**Função**: Primeira linha de resposta a anomalias
- Investigação de ocorrências sobrenaturais
- Contenção primária de ameaças
- Classificação inicial de entidades
- Operações de campo

**Agentes típicos**: Investigadores, agentes de campo, especialistas táticos

## 2. DOE - Divisão de Operações Especiais
**Função**: Operações de alto risco e combate
- Missões de contenção extrema
- Eliminação de ameaças Apollyon
- Resgate em zonas de colapso planar
- Operações secretas

**Agentes típicos**: Operadores de elite, specialists em Seeds de combate

## 3. DIP - Divisão de Inteligência e Planejamento
**Função**: Análise estratégica e coordenação
- Análise de padrões de ameaças
- Planejamento de operações complexas
- Inteligência sobre facções rivais
- Previsão de incursões planares

**Agentes típicos**: Analistas, estrategistas, especialistas em planos

## 4. DAP - Divisão de Análise e Pesquisa
**Função**: Pesquisa científica e desenvolvimento
- Estudo de Seeds e poderes
- Pesquisa planar
- Desenvolvimento de equipamentos
- Análise de artefatos

**Agentes típicos**: Cientistas, pesquisadores, ocultistas

## 5. DAS - Divisão de Apoio e Suporte
**Função**: Logística e suporte operacional
- Gerenciamento de recursos
- Suporte médico e psicológico
- Treinamento de agentes
- Manutenção de instalações

**Agentes típicos**: Médicos, psicólogos, instrutores, logística`,
    
    category: 'lore',
    isPrivate: false,
    sharedWith: ['user-002', 'user-003'],
    tags: ['lore', 'tower', 'divisões', 'organização'],
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'doc-002',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Sistema de Classificação de Ameaças',
    content: `# Sistema de Classificação de Ameaças da Tower

## Níveis de Contenção

### Safe (Seguro)
- **Descrição**: Entidades facilmente contidas com procedimentos simples
- **Exemplos**: Artefatos menores, entidades cooperativas
- **Protocolo**: Contenção passiva, monitoramento regular

### Eucalipto (Observação Constante)
- **Descrição**: Entidades que requerem observação ativa mas são previsíveis
- **Exemplos**: Entidades semi-sencientes, anomalias localizadas
- **Protocolo**: Monitoramento 24/7, procedimentos ativos

### Keter (Extremamente Perigoso)
- **Descrição**: Entidades altamente perigosas e difíceis de conter
- **Exemplos**: Entidades poderosas, anomalias expansivas
- **Protocolo**: Contenção máxima, múltiplas camadas de segurança

### Apollyon (Catastrófico)
- **Descrição**: Ameaças existenciais que podem destruir a realidade
- **Exemplos**: Entidades de nível deus, colapsos planares
- **Protocolo**: Eliminação prioritária, mobilização total

## Níveis de Perigo

- **Baixo**: Risco mínimo para agentes treinados
- **Médio**: Risco moderado, equipe completa recomendada
- **Alto**: Risco significativo, preparação extensiva necessária
- **Crítico**: Risco extremo, apenas agentes de elite`,
    
    category: 'rules',
    isPrivate: false,
    sharedWith: ['user-002', 'user-003'],
    tags: ['regras', 'classificação', 'ameaças'],
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'doc-003',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Notas do Mestre - Operação Eclipse',
    content: `# Notas Privadas - Operação Eclipse

## Planos Futuros

### Arco 1: Descoberta
- Jogadores investigam Sussurro das Sombras
- Descobrem conexão com Plano da Discórdia
- Dr. Vasquez revela informações sobre rituais de contenção

### Arco 2: Preparação
- Jogadores buscam artefatos de luz planar
- Treinamento especial com Seeds de luz
- Possível aliança com facção rival

### Arco 3: Confronto
- Infiltração no edifício
- Ritual de contenção
- Boss fight com manifestação completa
- Possível sacrifício de NPC aliado

## NPCs Importantes
- Dr. Elena Vasquez: Mentora, fornece Seeds
- Comandante Silva: Supervisor, pode virar antagonista
- "O Observador": NPC misterioso, aparece em momentos críticos

## Twists Planejados
- Sussurro das Sombras não é a verdadeira ameaça
- Há um traidor dentro da Tower
- Plano da Discórdia está vazando para nossa realidade`,
    
    category: 'notes',
    isPrivate: true,
    sharedWith: [],
    tags: ['privado', 'planejamento', 'spoilers'],
    
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21')
  }
]

export const getDocumentById = (id: string): Document | undefined => {
  return mockDocuments.find(doc => doc.id === id)
}

export const getDocumentsByCampaign = (campaignId: string): Document[] => {
  return mockDocuments.filter(doc => doc.campaignId === campaignId)
}

export const createDocument = (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document => {
  const newDocument: Document = {
    ...data,
    id: `doc-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  mockDocuments.push(newDocument)
  return newDocument
}

export const updateDocument = (id: string, data: Partial<Document>): Document | undefined => {
  const index = mockDocuments.findIndex(d => d.id === id)
  if (index === -1) return undefined
  
  mockDocuments[index] = {
    ...mockDocuments[index],
    ...data,
    updatedAt: new Date()
  }
  return mockDocuments[index]
}
