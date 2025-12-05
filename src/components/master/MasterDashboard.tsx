import React, { useState, useEffect } from 'react'
import { User, Campaign, Character, NPC, Threat } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Users, FileText, AlertTriangle, ScrollText, Plus } from 'lucide-react'

interface MasterDashboardProps {
  user: User
  onSelectCampaign: (campaign: Campaign) => void
  onCreateCampaign: () => void
}

export function MasterDashboard({ user, onSelectCampaign, onCreateCampaign }: MasterDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalNPCs: 0,
    totalThreats: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [user.id])
  
  const loadData = async () => {
    try {
      const camps = await api.getCampaigns()
      setCampaigns(camps)
      
      // Load stats for all campaigns
      let totalChars = 0
      let totalNPCs = 0
      let totalThreats = 0
      
      for (const camp of camps) {
        const [chars, npcs, threats] = await Promise.all([
          api.getCharacters(camp.id),
          api.getNPCs(camp.id),
          api.getThreats(camp.id)
        ])
        totalChars += chars.length
        totalNPCs += npcs.length
        totalThreats += threats.length
      }
      
      setStats({
        totalCharacters: totalChars,
        totalNPCs: totalNPCs,
        totalThreats: totalThreats
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#00FF41] animate-pulse">Carregando dados...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#00FF41]">Área do Mestre</h1>
            <p className="text-[#CCCCCC]">Bem-vindo, Mestre {user.name}</p>
          </div>
          <Button onClick={onCreateCampaign}>
            <Plus className="w-4 h-4" />
            Nova Campanha
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-[#00FF41]" />
              <div>
                <p className="text-[#CCCCCC]">Campanhas</p>
                <p className="text-[#00FF41]">{campaigns.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-[#00DDFF]" />
              <div>
                <p className="text-[#CCCCCC]">Personagens</p>
                <p className="text-[#00DDFF]">{stats.totalCharacters}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <ScrollText className="w-8 h-8 text-[#FF00FF]" />
              <div>
                <p className="text-[#CCCCCC]">NPCs</p>
                <p className="text-[#FF00FF]">{stats.totalNPCs}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-[#FF0033]" />
              <div>
                <p className="text-[#CCCCCC]">Ameaças</p>
                <p className="text-[#FF0033]">{stats.totalThreats}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Campaigns Section */}
        <div>
          <h2 className="text-[#00FF41] mb-4">Suas Campanhas</h2>
          
          {campaigns.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999] mb-4">Você ainda não criou nenhuma campanha</p>
                <Button onClick={onCreateCampaign}>
                  <Plus className="w-4 h-4" />
                  Criar Primeira Campanha
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  glowOnHover 
                  className="cursor-pointer"
                  onClick={() => onSelectCampaign(campaign)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#00FF41]">{campaign.name}</h3>
                        <p className="text-[#CCCCCC] text-sm line-clamp-2">{campaign.description}</p>
                      </div>
                      <span className={`
                        px-2 py-1 rounded text-xs whitespace-nowrap ml-2
                        ${campaign.status === 'active' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                        ${campaign.status === 'paused' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                        ${campaign.status === 'completed' ? 'bg-[#666666]/20 text-[#666666]' : ''}
                      `}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#00FF41]/30 pt-3">
                      <p className="text-[#999999]">
                        Criada em {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <Card>
          <h3 className="text-[#00FF41] mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="secondary" size="sm" className="w-full">
              <FileText className="w-4 h-4" />
              Ver Fichas
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              <ScrollText className="w-4 h-4" />
              Criar NPC
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              <AlertTriangle className="w-4 h-4" />
              Nova Ameaça
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              <Users className="w-4 h-4" />
              Convocar Sessão
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
