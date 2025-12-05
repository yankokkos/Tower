import React, { useState, useEffect } from 'react'
import { Campaign, Character, NPC, Threat } from '../../types'
import { api } from '../../services/api'
import { ReportsList } from './ReportsList'
import { SummonsList } from './SummonsList'
import { DocumentsList } from './DocumentsList'
import { CampaignTimeline } from './CampaignTimeline'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { ArrowLeft, FileText, Users, AlertTriangle, Plus, Calendar, FolderOpen, Clock } from 'lucide-react'

interface CampaignViewProps {
  campaign: Campaign
  currentUserId: string
  userRole: 'player' | 'master'
  onBack: () => void
  onCreateNPC?: () => void
  onCreateThreat?: () => void
  onCreateReport?: () => void
  onCreateSummon?: () => void
  onCreateDocument?: () => void
  onCreateEvent?: () => void
}

export function CampaignView({ campaign, currentUserId, userRole, onBack, onCreateNPC, onCreateThreat, onCreateReport, onCreateSummon, onCreateDocument, onCreateEvent }: CampaignViewProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [npcs, setNPCs] = useState<NPC[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [campaign.id])
  
  const loadData = async () => {
    try {
      const [chars, npcsData, threatsData] = await Promise.all([
        api.getCharacters(campaign.id),
        api.getNPCs(campaign.id),
        api.getThreats(campaign.id)
      ])
      setCharacters(chars)
      setNPCs(npcsData)
      setThreats(threatsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#00FF41] animate-pulse">Carregando campanha...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
        
        {/* Campaign Info */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[#00FF41]">{campaign.name}</h1>
                <p className="text-[#CCCCCC]">{campaign.description}</p>
              </div>
              <span className={`
                px-3 py-1 rounded
                ${campaign.status === 'active' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                ${campaign.status === 'paused' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                ${campaign.status === 'completed' ? 'bg-[#666666]/20 text-[#666666]' : ''}
              `}>
                {campaign.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#00FF41]/30">
              <div>
                <p className="text-[#999999]">Personagens</p>
                <p className="text-[#00FF41]">{characters.length}</p>
              </div>
              <div>
                <p className="text-[#999999]">NPCs</p>
                <p className="text-[#FF00FF]">{npcs.length}</p>
              </div>
              <div>
                <p className="text-[#999999]">Ameaças</p>
                <p className="text-[#FF0033]">{threats.length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Characters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#00FF41]">Personagens dos Jogadores</h2>
          </div>
          
          {characters.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999]">Nenhum personagem nesta campanha ainda</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <Card key={character.id} glowOnHover>
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
                        <p className="text-[#00DDFF]">{character.statusDerived.ps}/{character.statusDerived.psMax}</p>
                      </div>
                      <div className="bg-[#1A1A1A] rounded p-2">
                        <p className="text-[#999999]">PE</p>
                        <p className="text-[#FF00FF]">{character.statusDerived.pe}/{character.statusDerived.peMax}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* NPCs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#FF00FF]">NPCs</h2>
            <Button size="sm" onClick={onCreateNPC}>
              <Plus className="w-4 h-4" />
              Novo NPC
            </Button>
          </div>
          
          {npcs.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999] mb-4">Nenhum NPC criado ainda</p>
                <Button size="sm" onClick={onCreateNPC}>
                  <Plus className="w-4 h-4" />
                  Criar Primeiro NPC
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {npcs.map((npc) => (
                <Card key={npc.id} glowOnHover>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#FF00FF]">{npc.name}</h3>
                        <p className="text-[#CCCCCC]">{npc.affiliation}</p>
                        {npc.rank && <p className="text-[#999999]">{npc.rank}</p>}
                      </div>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${npc.status === 'alive' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                        ${npc.status === 'injured' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                        ${npc.status === 'kia' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
                      `}>
                        {npc.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[#CCCCCC] text-sm line-clamp-2">{npc.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Threats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#FF0033]">Ameaças</h2>
            <Button size="sm" variant="danger" onClick={onCreateThreat}>
              <Plus className="w-4 h-4" />
              Nova Ameaça
            </Button>
          </div>
          
          {threats.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-[#666666] mx-auto mb-4" />
                <p className="text-[#999999] mb-4">Nenhuma ameaça registrada</p>
                <Button size="sm" variant="danger" onClick={onCreateThreat}>
                  <Plus className="w-4 h-4" />
                  Registrar Primeira Ameaça
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {threats.map((threat) => (
                <Card key={threat.id} glowOnHover className="border-[#FF0033]">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[#FF0033]">{threat.name}</h3>
                        <p className="text-[#999999]">{threat.code}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`
                          px-2 py-1 rounded text-xs text-center
                          ${threat.containmentLevel === 'safe' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                          ${threat.containmentLevel === 'eucalipto' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                          ${threat.containmentLevel === 'keter' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
                          ${threat.containmentLevel === 'apollyon' ? 'bg-[#FF00FF]/20 text-[#FF00FF]' : ''}
                        `}>
                          {threat.containmentLevel.toUpperCase()}
                        </span>
                        <span className={`
                          px-2 py-1 rounded text-xs text-center
                          ${threat.status === 'contained' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                          ${threat.status === 'supervised' ? 'bg-[#FF9900]/20 text-[#FF9900]' : ''}
                          ${threat.status === 'to_capture' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
                          ${threat.status === 'eliminated' ? 'bg-[#666666]/20 text-[#666666]' : ''}
                        `}>
                          {threat.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-[#CCCCCC] text-sm line-clamp-2">{threat.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FF0033]/30">
                      <div>
                        <p className="text-[#999999]">Tipo</p>
                        <p className="text-white capitalize">{threat.type}</p>
                      </div>
                      <div>
                        <p className="text-[#999999]">PV</p>
                        <p className="text-[#FF0033]">{threat.combatStats.pv}/{threat.combatStats.pvMax}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Reports */}
        <ReportsList 
          campaignId={campaign.id}
          currentUserId={currentUserId}
          onCreateReport={onCreateReport}
        />
        
        {/* Summons */}
        <SummonsList 
          campaignId={campaign.id}
          currentUserId={currentUserId}
          userRole={userRole}
          onCreateSummon={userRole === 'master' ? onCreateSummon : undefined}
        />
        
        {/* Documents */}
        <DocumentsList 
          campaignId={campaign.id}
          currentUserId={currentUserId}
          userRole={userRole}
          onCreateDocument={userRole === 'master' ? onCreateDocument : undefined}
        />
        
        {/* Timeline */}
        <CampaignTimeline 
          campaignId={campaign.id}
          userRole={userRole}
          onCreateEvent={userRole === 'master' ? onCreateEvent : undefined}
        />
      </div>
    </div>
  )
}