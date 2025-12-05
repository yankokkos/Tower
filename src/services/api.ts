import { API_CONFIG } from '../config/api'
import { authUtils } from '../utils/auth'
import type { 
  Character, 
  AuthResponse, 
  User, 
  Campaign, 
  NPC, 
  Threat, 
  Report, 
  Summon, 
  Document, 
  CampaignEvent 
} from '../types'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: any[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Função auxiliar para fazer requisições HTTP
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const auth = authUtils.getAuth()
  const token = auth?.token

  const headers: HeadersInit = {
    ...API_CONFIG.defaultHeaders,
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_CONFIG.baseURL}${endpoint}`
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Se a resposta não for JSON (ex: 204 No Content), retornar vazio
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data: ApiResponse<T>
    
    if (isJson) {
      data = await response.json()
    } else {
      data = { success: response.ok } as ApiResponse<T>
    }

    if (!response.ok) {
      // Se for 401, limpar autenticação
      if (response.status === 401) {
        authUtils.clearAuth()
      }
      
      const message = data.message || `Erro ${response.status}: ${response.statusText}`
      throw new ApiError(message, response.status, data.errors)
    }

    // Se a resposta tem data, retornar data, senão retornar a resposta completa
    return (data.data !== undefined ? data.data : data) as T
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Timeout na requisição', 408)
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Erro desconhecido na requisição',
      500
    )
  }
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return response
  },

  async register(
    email: string,
    password: string,
    name: string,
    role: 'player' | 'master' = 'player'
  ): Promise<AuthResponse> {
    const response = await request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    })
    return response
  },

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return request<Campaign[]>('/api/v1/campaigns')
  },

  async getCampaign(id: string): Promise<Campaign> {
    return request<Campaign>(`/api/v1/campaigns/${id}`)
  },

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    return request<Campaign>('/api/v1/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    return request<Campaign>(`/api/v1/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteCampaign(id: string): Promise<void> {
    await request(`/api/v1/campaigns/${id}`, {
      method: 'DELETE',
    })
  },

  // Characters
  async getCharacters(campaignId?: string, playerId?: string): Promise<Character[]> {
    const params = new URLSearchParams()
    if (campaignId) params.append('campaign_id', campaignId)
    if (playerId) params.append('player_id', playerId)
    
    const query = params.toString()
    return request<Character[]>(`/api/v1/characters${query ? `?${query}` : ''}`)
  },

  async getCharacter(id: string): Promise<Character> {
    return request<Character>(`/api/v1/characters/${id}`)
  },

  async createCharacter(data: Partial<Character>): Promise<Character> {
    return request<Character>('/api/v1/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateCharacter(id: string, data: Partial<Character>): Promise<Character> {
    return request<Character>(`/api/v1/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteCharacter(id: string): Promise<void> {
    await request(`/api/v1/characters/${id}`, {
      method: 'DELETE',
    })
  },

  // NPCs
  async getNPCs(campaignId: string): Promise<NPC[]> {
    return request<NPC[]>(`/api/v1/npcs?campaign_id=${campaignId}`)
  },

  async getNPC(id: string): Promise<NPC> {
    return request<NPC>(`/api/v1/npcs/${id}`)
  },

  async createNPC(data: Partial<NPC>): Promise<NPC> {
    return request<NPC>('/api/v1/npcs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateNPC(id: string, data: Partial<NPC>): Promise<NPC> {
    return request<NPC>(`/api/v1/npcs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Threats
  async getThreats(campaignId: string): Promise<Threat[]> {
    return request<Threat[]>(`/api/v1/threats?campaign_id=${campaignId}`)
  },

  async getThreat(id: string): Promise<Threat> {
    return request<Threat>(`/api/v1/threats/${id}`)
  },

  async createThreat(data: Partial<Threat>): Promise<Threat> {
    return request<Threat>('/api/v1/threats', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateThreat(id: string, data: Partial<Threat>): Promise<Threat> {
    return request<Threat>(`/api/v1/threats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Reports
  async getReports(campaignId: string): Promise<Report[]> {
    return request<Report[]>(`/api/v1/reports?campaign_id=${campaignId}`)
  },

  async getReport(id: string): Promise<Report> {
    return request<Report>(`/api/v1/reports/${id}`)
  },

  async createReport(data: Partial<Report>): Promise<Report> {
    return request<Report>('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    return request<Report>(`/api/v1/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Summons
  async getSummons(campaignId: string): Promise<Summon[]> {
    return request<Summon[]>(`/api/v1/summons?campaign_id=${campaignId}`)
  },

  async getSummon(id: string): Promise<Summon> {
    return request<Summon>(`/api/v1/summons/${id}`)
  },

  async createSummon(data: Partial<Summon>): Promise<Summon> {
    return request<Summon>('/api/v1/summons', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateSummon(id: string, data: Partial<Summon>): Promise<Summon> {
    return request<Summon>(`/api/v1/summons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async confirmSummon(id: string): Promise<Summon> {
    return request<Summon>(`/api/v1/summons/${id}/confirm`, {
      method: 'POST',
    })
  },

  async declineSummon(id: string): Promise<Summon> {
    return request<Summon>(`/api/v1/summons/${id}/decline`, {
      method: 'POST',
    })
  },

  // Documents
  async getDocuments(campaignId: string): Promise<Document[]> {
    return request<Document[]>(`/api/v1/documents?campaign_id=${campaignId}`)
  },

  async getDocument(id: string): Promise<Document> {
    return request<Document>(`/api/v1/documents/${id}`)
  },

  async createDocument(data: Partial<Document>): Promise<Document> {
    return request<Document>('/api/v1/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateDocument(id: string, data: Partial<Document>): Promise<Document> {
    return request<Document>(`/api/v1/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Events
  async getEvents(campaignId: string): Promise<CampaignEvent[]> {
    return request<CampaignEvent[]>(`/api/v1/events?campaign_id=${campaignId}`)
  },

  async getEvent(id: string): Promise<CampaignEvent> {
    return request<CampaignEvent>(`/api/v1/events/${id}`)
  },

  async createEvent(data: Partial<CampaignEvent>): Promise<CampaignEvent> {
    return request<CampaignEvent>('/api/v1/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateEvent(id: string, data: Partial<CampaignEvent>): Promise<CampaignEvent> {
    return request<CampaignEvent>(`/api/v1/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Reference Data (Dados de Referência)
  async getPlanes(): Promise<any[]> {
    return request<any[]>('/api/v1/reference/planes')
  },

  async getEquipmentTemplates(type?: string, category?: string): Promise<any[]> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (category) params.append('category', category)
    const query = params.toString()
    return request<any[]>(`/api/v1/reference/equipment${query ? '?' + query : ''}`)
  },

  async getAdvantages(category?: string): Promise<any[]> {
    const query = category ? `?category=${category}` : ''
    return request<any[]>(`/api/v1/reference/advantages${query}`)
  },

  async getDisadvantages(category?: string): Promise<any[]> {
    const query = category ? `?category=${category}` : ''
    return request<any[]>(`/api/v1/reference/disadvantages${query}`)
  },
}

// Exportar também o tipo de erro para uso nos componentes
export { ApiError }
