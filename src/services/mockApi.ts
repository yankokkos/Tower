import { 
  mockUsers, getUserById, getUserByEmail, authenticateUser,
  mockCampaigns, getCampaignById, getCampaignsByMaster, getCampaignsByPlayer,
  mockCharacters, getCharacterById, getCharactersByCampaign, getCharactersByPlayer,
  mockNPCs, getNPCById, getNPCsByCampaign,
  mockThreats, getThreatById, getThreatsByCampaign,
  mockReports, getReportById, getReportsByCampaign, createReport, updateReport,
  mockSummons, getSummonById, getSummonsByCampaign, createSummon, updateSummon, confirmSummon, declineSummon,
  mockDocuments, getDocumentById, getDocumentsByCampaign, createDocument, updateDocument,
  mockEvents, getEventById, getEventsByCampaign, createEvent
} from '../mocks'
import { Character, AuthResponse, User, Campaign, NPC, Threat, Report, Summon, Document, CampaignEvent } from '../types'

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
  
  async getUsers() {
    await delay(200)
    return mockUsers
  },
  
  async register(email: string, password: string, name: string, role: 'player' | 'master'): Promise<AuthResponse> {
    await delay(600)
    if (getUserByEmail(email)) {
      throw new Error('Email já cadastrado')
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password: `$2b$10$hash${password}`,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockUsers.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    return { user: userWithoutPassword as User, token: `mock-token-${newUser.id}` }
  },
  
  // Campaigns
  async getCampaigns(userId: string, role: 'player' | 'master'): Promise<Campaign[]> {
    await delay(300)
    if (role === 'master') {
      return getCampaignsByMaster(userId)
    }
    return getCampaignsByPlayer(userId)
  },
  
  async getCampaign(id: string): Promise<Campaign | undefined> {
    await delay(200)
    return getCampaignById(id)
  },
  
  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    await delay(500)
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: data.name || '',
      description: data.description || '',
      masterId: data.masterId || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockCampaigns.push(newCampaign)
    return newCampaign
  },
  
  // Characters
  async getCharacters(campaignId?: string, playerId?: string): Promise<Character[]> {
    await delay(300)
    if (campaignId) return getCharactersByCampaign(campaignId)
    if (playerId) return getCharactersByPlayer(playerId)
    return mockCharacters
  },
  
  async getCharacter(id: string): Promise<Character | undefined> {
    await delay(200)
    return getCharacterById(id)
  },
  
  async createCharacter(data: Partial<Character>): Promise<Character> {
    await delay(500)
    const newChar: Character = {
      id: `char-${Date.now()}`,
      campaignId: data.campaignId || '',
      playerId: data.playerId || '',
      name: data.name || '',
      concept: data.concept || '',
      origin: data.origin || '',
      age: data.age || 25,
      status: data.status || 'active',
      attributes: data.attributes || {
        forca: 1,
        destreza: 1,
        constituicao: 1,
        inteligencia: 1,
        sabedoria: 1,
        carisma: 1,
        poder: 1
      },
      statusDerived: data.statusDerived || {
        pv: 5,
        pvMax: 5,
        ps: 5,
        psMax: 5,
        pe: 5,
        peMax: 5,
        defense: 1,
        initiative: 1
      },
      skills: data.skills || [],
      advantages: data.advantages || [],
      disadvantages: data.disadvantages || [],
      labels: data.labels || { power: '', weakness: '' },
      innerPlane: data.innerPlane || { name: '', type: 'fruit', description: '' },
      seeds: data.seeds || [],
      powerThemes: data.powerThemes || [],
      powerCards: data.powerCards || [],
      equipment: data.equipment || [],
      history: data.history || '',
      relationships: data.relationships || [],
      xp: data.xp || 0,
      xpTotal: data.xpTotal || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || '',
      lastModifiedBy: data.lastModifiedBy || ''
    } as Character
    mockCharacters.push(newChar)
    return newChar
  },
  
  async updateCharacter(id: string, data: Partial<Character>): Promise<Character> {
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
  
  async getReport(id: string) {
    await delay(200)
    return getReportById(id)
  },
  
  async createReport(data: Partial<Report>) {
    await delay(500)
    const newReport: Report = {
      id: `report-${Date.now()}`,
      campaignId: data.campaignId || '',
      title: data.title || '',
      content: data.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || '',
      lastModifiedBy: data.lastModifiedBy || ''
    } as Report
    mockReports.push(newReport)
    return newReport
  },
  
  async updateReport(id: string, data: Partial<Report>) {
    await delay(400)
    const index = mockReports.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Relatório não encontrado')
    mockReports[index] = { ...mockReports[index], ...data, updatedAt: new Date() }
    return mockReports[index]
  },
  
  // Summons
  async getSummons(campaignId: string) {
    await delay(300)
    return getSummonsByCampaign(campaignId)
  },
  
  async getSummon(id: string) {
    await delay(200)
    return getSummonById(id)
  },
  
  async createSummon(data: Partial<Summon>) {
    await delay(500)
    const newSummon: Summon = {
      id: `summon-${Date.now()}`,
      campaignId: data.campaignId || '',
      title: data.title || '',
      content: data.content || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || '',
      lastModifiedBy: data.lastModifiedBy || ''
    } as Summon
    mockSummons.push(newSummon)
    return newSummon
  },
  
  async updateSummon(id: string, data: Partial<Summon>) {
    await delay(400)
    const index = mockSummons.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Convocação não encontrada')
    mockSummons[index] = { ...mockSummons[index], ...data, updatedAt: new Date() }
    return mockSummons[index]
  },
  
  async confirmSummon(id: string) {
    await delay(400)
    const index = mockSummons.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Convocação não encontrada')
    mockSummons[index] = { ...mockSummons[index], status: 'confirmed', updatedAt: new Date() }
    return mockSummons[index]
  },
  
  async declineSummon(id: string) {
    await delay(400)
    const index = mockSummons.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Convocação não encontrada')
    mockSummons[index] = { ...mockSummons[index], status: 'declined', updatedAt: new Date() }
    return mockSummons[index]
  },
  
  // Documents
  async getDocuments(campaignId: string) {
    await delay(300)
    return getDocumentsByCampaign(campaignId)
  },
  
  async getDocument(id: string) {
    await delay(200)
    return getDocumentById(id)
  },
  
  async createDocument(data: Partial<Document>) {
    await delay(500)
    const newDocument: Document = {
      id: `document-${Date.now()}`,
      campaignId: data.campaignId || '',
      title: data.title || '',
      content: data.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || '',
      lastModifiedBy: data.lastModifiedBy || ''
    } as Document
    mockDocuments.push(newDocument)
    return newDocument
  },
  
  async updateDocument(id: string, data: Partial<Document>) {
    await delay(400)
    const index = mockDocuments.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Documento não encontrado')
    mockDocuments[index] = { ...mockDocuments[index], ...data, updatedAt: new Date() }
    return mockDocuments[index]
  },
  
  // Events
  async getEvents(campaignId: string) {
    await delay(300)
    return getEventsByCampaign(campaignId)
  },
  
  async getEvent(id: string) {
    await delay(200)
    return getEventById(id)
  },
  
  async createEvent(data: Partial<CampaignEvent>) {
    await delay(500)
    const newEvent: CampaignEvent = {
      id: `event-${Date.now()}`,
      campaignId: data.campaignId || '',
      title: data.title || '',
      content: data.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || '',
      lastModifiedBy: data.lastModifiedBy || ''
    } as CampaignEvent
    mockEvents.push(newEvent)
    return newEvent
  }
}