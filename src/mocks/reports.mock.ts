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
- Primeiro contato com a entidade
- Descoberta de três vítimas em estado catatônico
- Fuga bem-sucedida após manifestação da entidade

## Personagens Envolvidos
- Marcus Coleman: Liderou a investigação
- Equipe de apoio tático

## Descobertas
- Entidade se manifesta em locais com pouca luz
- Vítimas apresentam sinais de trauma psíquico severo
- Símbolos estranhos encontrados nas paredes

## Próximos Passos
- Continuar investigação sobre origem planar
- Consultar Dr. Elena Vasquez sobre símbolos
- Planejar estratégia de contenção`,
    
    type: 'session',
    date: new Date('2024-01-20'),
    tags: ['sessão', 'investigação', 'ameaça', 'operação-eclipse'],
    
    isPrivate: false,
    sharedWith: ['user-002', 'user-003'],
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'report-002',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Análise: Sussurro das Sombras',
    content: `# Análise da Ameaça: Sussurro das Sombras

## Classificação
- **Nível de Contenção**: Keter
- **Nível de Perigo**: Alto
- **Origem**: Plano da Discórdia

## Capacidades Observadas
1. Possessão através de medos inconscientes
2. Manipulação de sombras físicas
3. Leitura de pensamentos superficiais
4. Invisibilidade total em escuridão

## Vulnerabilidades Identificadas
- Luz intensa causa desconforto severo
- Símbolos sagrados de várias tradições causam repulsão
- Energia positiva/luz planar causa dano real

## Recomendações
- Usar lanternas táticas de alta intensidade
- Preparar amuletos de proteção
- Considerar recrutar especialista em exorcismo`,
    
    type: 'threat',
    date: new Date('2024-01-21'),
    tags: ['análise', 'ameaça', 'sussurro-das-sombras'],
    
    isPrivate: true,
    sharedWith: [],
    
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
]

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id)
}

export const getReportsByCampaign = (campaignId: string): Report[] => {
  return mockReports.filter(report => report.campaignId === campaignId)
}

export const createReport = (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report => {
  const newReport: Report = {
    ...data,
    id: `report-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  mockReports.push(newReport)
  return newReport
}

export const updateReport = (id: string, data: Partial<Report>): Report | undefined => {
  const index = mockReports.findIndex(r => r.id === id)
  if (index === -1) return undefined
  
  mockReports[index] = {
    ...mockReports[index],
    ...data,
    updatedAt: new Date()
  }
  return mockReports[index]
}
