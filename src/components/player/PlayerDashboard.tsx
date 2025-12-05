import React, { useState, useEffect } from 'react'
import { User, Character, Campaign } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { FileText, Plus, Users, Calendar } from 'lucide-react'

interface PlayerDashboardProps {
  user: User
  onViewCharacter: (character: Character) => void
  onCreateCharacter: () => void
}

export function PlayerDashboard({ user, onViewCharacter, onCreateCharacter }: PlayerDashboardProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [user.id])
  
  const loadData = async () => {
    try {
      const [chars, camps] = await Promise.all([
        api.getCharacters(undefined, user.id),
        api.getCampaigns()
      ])
      setCharacters(chars)
      setCampaigns(camps)
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
            <h1 className="text-[#00FF41]">Área do Jogador</h1>
            <p className="text-[#CCCCCC]">Bem-vindo, {user.name}</p>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-[#00FF41]" />
              <div>
                <p className="text-[#CCCCCC]">Personagens</p>
                <p className="text-[#00FF41]">{characters.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-[#00FF41]" />
              <div>
                <p className="text-[#CCCCCC]">Campanhas Ativas</p>
                <p className="text-[#00FF41]">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-[#00FF41]" />
              <div>
                <p className="text-[#CCCCCC]">Próxima Sessão</p>
                <p className="text-[#00FF41]">Em breve</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Characters Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#00FF41]">Meus Personagens</h2>
            <Button onClick={onCreateCharacter} size="sm">
              <Plus className="w-4 h-4" />
              Novo Personagem
            </Button>
          </div>
          
          {characters.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999] mb-4">Você ainda não criou nenhum personagem</p>
                <Button onClick={onCreateCharacter}>
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Personagem
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <Card key={character.id} glowOnHover className="cursor-pointer" onClick={() => onViewCharacter(character)}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#00FF41]">{character.name}</h3>
                        <p className="text-[#CCCCCC]">{character.concept}</p>
                      </div>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${character.status === 'active' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                        ${character.status === 'mission' ? 'bg-[#00DDFF]/20 text-[#00DDFF]' : ''}
                        ${character.status === 'injured' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
                      `}>
                        {character.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#1A1A1A] rounded p-2">
                        <p className="text-[#999999]">PV</p>
                        <p className="text-[#00FF41]">{character.statusDerived.pv}/{character.statusDerived.pvMax}</p>
                      </div>
                      <div className="bg-[#1A1A1A] rounded p-2">
                        <p className="text-[#999999]">PS</p>
                        <p className="text-[#00FF41]">{character.statusDerived.ps}/{character.statusDerived.psMax}</p>
                      </div>
                      <div className="bg-[#1A1A1A] rounded p-2">
                        <p className="text-[#999999]">PE</p>
                        <p className="text-[#00FF41]">{character.statusDerived.pe}/{character.statusDerived.peMax}</p>
                      </div>
                    </div>
                    
                    {character.code && (
                      <p className="text-[#666666] text-center">{character.code}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Campaigns Section */}
        <div>
          <h2 className="text-[#00FF41] mb-4">Campanhas</h2>
          {campaigns.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999]">Você não está em nenhuma campanha ativa</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[#00FF41]">{campaign.name}</h3>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${campaign.status === 'active' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                        ${campaign.status === 'paused' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                        ${campaign.status === 'completed' ? 'bg-[#666666]/20 text-[#666666]' : ''}
                      `}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[#CCCCCC]">{campaign.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
