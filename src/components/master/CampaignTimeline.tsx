import React, { useState, useEffect } from 'react'
import { CampaignEvent } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Clock, Target, Skull, Trophy, HelpCircle, Plus } from 'lucide-react'

interface CampaignTimelineProps {
  campaignId: string
  userRole: 'player' | 'master'
  onCreateEvent?: () => void
}

export function CampaignTimeline({ campaignId, userRole, onCreateEvent }: CampaignTimelineProps) {
  const [events, setEvents] = useState<CampaignEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadEvents()
  }, [campaignId])
  
  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await api.getEvents(campaignId)
      setEvents(data)
    } catch (error) {
      alert('Erro ao carregar timeline')
    } finally {
      setLoading(false)
    }
  }
  
  const getEventIcon = (type: CampaignEvent['type']) => {
    const icons = {
      mission: <Target className="w-5 h-5" />,
      discovery: <HelpCircle className="w-5 h-5" />,
      death: <Skull className="w-5 h-5" />,
      achievement: <Trophy className="w-5 h-5" />,
      other: <Clock className="w-5 h-5" />
    }
    return icons[type] || icons.other
  }
  
  const getEventColor = (type: CampaignEvent['type']) => {
    const colors = {
      mission: 'text-[#00FF41] border-[#00FF41] bg-[#00FF41]/10',
      discovery: 'text-[#00DDFF] border-[#00DDFF] bg-[#00DDFF]/10',
      death: 'text-[#FF0033] border-[#FF0033] bg-[#FF0033]/10',
      achievement: 'text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10',
      other: 'text-[#FFFFFF] border-[#FFFFFF] bg-[#FFFFFF]/10'
    }
    return colors[type] || colors.other
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-[#00FF41]">Carregando timeline...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-[#00FF41]">Timeline da Campanha</h2>
        </div>
        {userRole === 'master' && onCreateEvent && (
          <Button onClick={onCreateEvent} size="sm">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        )}
      </div>
      
      {events.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <p className="text-[#999999] mb-4">Nenhum evento registrado ainda</p>
            {userRole === 'master' && onCreateEvent && (
              <Button onClick={onCreateEvent} size="sm">
                Registrar Primeiro Evento
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#00FF41]/30" />
          
          <div className="space-y-6">
            {events.map((event, index) => {
              const colorClasses = getEventColor(event.type)
              
              return (
                <div key={event.id} className="relative pl-20">
                  {/* Círculo na linha do tempo */}
                  <div className={`
                    absolute left-6 top-4
                    w-6 h-6 rounded-full border-2
                    flex items-center justify-center
                    ${colorClasses}
                  `}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Card do evento */}
                  <Card className={`border-l-4 ${colorClasses.split('bg-')[0]}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-white flex-1">{event.title}</h3>
                        <span className="text-xs text-[#999999] whitespace-nowrap">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      <p className="text-[#CCCCCC] text-sm">
                        {event.description}
                      </p>
                      
                      {/* Tags de relacionamentos */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {event.relatedCharacters && event.relatedCharacters.length > 0 && (
                          <span className="px-2 py-1 bg-[#1A1A1A] text-[#00FF41] rounded border border-[#333333]">
                            {event.relatedCharacters.length} personagem(ns)
                          </span>
                        )}
                        {event.relatedThreats && event.relatedThreats.length > 0 && (
                          <span className="px-2 py-1 bg-[#1A1A1A] text-[#FF0033] rounded border border-[#333333]">
                            {event.relatedThreats.length} ameaça(s)
                          </span>
                        )}
                        {event.relatedNPCs && event.relatedNPCs.length > 0 && (
                          <span className="px-2 py-1 bg-[#1A1A1A] text-[#00DDFF] rounded border border-[#333333]">
                            {event.relatedNPCs.length} NPC(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
