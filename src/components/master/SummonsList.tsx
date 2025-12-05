import React, { useState, useEffect } from 'react'
import { Summon } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Calendar, Plus, Users, Clock, Check, X, Bell } from 'lucide-react'
import { Modal } from '../common/Modal'

interface SummonsListProps {
  campaignId: string
  currentUserId: string
  userRole: 'player' | 'master'
  onCreateSummon?: () => void
}

export function SummonsList({ campaignId, currentUserId, userRole, onCreateSummon }: SummonsListProps) {
  const [summons, setSummons] = useState<Summon[]>([])
  const [selectedSummon, setSelectedSummon] = useState<Summon | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadSummons()
  }, [campaignId])
  
  const loadSummons = async () => {
    try {
      setLoading(true)
      const data = await api.getSummons(campaignId)
      setSummons(data)
    } catch (error) {
      alert('Erro ao carregar convocações')
    } finally {
      setLoading(false)
    }
  }
  
  const handleConfirm = async (summonId: string) => {
    try {
      const summon = summons.find(s => s.id === summonId)
      if (!summon) return
      
      await api.confirmSummon(summonId)
      await loadSummons()
      alert('Presença confirmada!')
    } catch (error) {
      alert('Erro ao confirmar presença')
    }
  }
  
  const handleDecline = async (summonId: string) => {
    try {
      const summon = summons.find(s => s.id === summonId)
      if (!summon) return
      
      await api.declineSummon(summonId)
      await loadSummons()
      alert('Presença recusada')
    } catch (error) {
      alert('Erro ao recusar presença')
    }
  }
  
  const getStatusColor = (status: Summon['status']) => {
    const colors = {
      pending: 'text-[#FFD700] border-[#FFD700]',
      confirmed: 'text-[#00FF41] border-[#00FF41]',
      cancelled: 'text-[#999999] border-[#999999]',
      completed: 'text-[#00DDFF] border-[#00DDFF]'
    }
    return colors[status] || colors.pending
  }
  
  const getStatusLabel = (status: Summon['status']) => {
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Concluída'
    }
    return labels[status] || 'Pendente'
  }
  
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const isUpcoming = (date: Date) => {
    return new Date(date) > new Date()
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-[#00FF41]">Carregando convocações...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-[#00FF41]">Convocações</h2>
        </div>
        {userRole === 'master' && onCreateSummon && (
          <Button onClick={onCreateSummon} size="sm">
            <Plus className="w-4 h-4" />
            Nova Convocação
          </Button>
        )}
      </div>
      
      {summons.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <p className="text-[#999999] mb-4">Nenhuma convocação agendada</p>
            {userRole === 'master' && onCreateSummon && (
              <Button onClick={onCreateSummon} size="sm">
                Criar Primeira Convocação
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {summons.map((summon) => {
            const upcoming = isUpcoming(summon.scheduledDate)
            const isConfirmed = summon.confirmedPlayers.includes(currentUserId)
            const isDeclined = summon.declinedPlayers.includes(currentUserId)
            
            return (
              <Card
                key={summon.id}
                className={`cursor-pointer hover:border-[#00FF41] transition-all ${
                  upcoming ? 'border-l-4 border-l-[#00FF41]' : ''
                }`}
                onClick={() => setSelectedSummon(summon)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white">{summon.title}</h3>
                        {upcoming && (
                          <Bell className="w-4 h-4 text-[#FFD700] animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#999999]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDateTime(summon.scheduledDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {summon.confirmedPlayers.length}/{summon.invitedPlayers.length}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(summon.status)}`}>
                      {getStatusLabel(summon.status)}
                    </span>
                  </div>
                  
                  <p className="text-[#CCCCCC] text-sm line-clamp-2">
                    {summon.message}
                  </p>
                  
                  {userRole === 'player' && summon.status === 'pending' && upcoming && (
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfirm(summon.id)
                        }}
                        size="sm"
                        variant={isConfirmed ? 'primary' : 'secondary'}
                        disabled={isConfirmed}
                      >
                        <Check className="w-4 h-4" />
                        {isConfirmed ? 'Confirmado' : 'Confirmar Presença'}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDecline(summon.id)
                        }}
                        size="sm"
                        variant={isDeclined ? 'danger' : 'ghost'}
                        disabled={isDeclined}
                      >
                        <X className="w-4 h-4" />
                        {isDeclined ? 'Recusado' : 'Recusar'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
      
      {/* Modal de Detalhes */}
      {selectedSummon && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSummon(null)}
          title={selectedSummon.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 border rounded ${getStatusColor(selectedSummon.status)}`}>
                {getStatusLabel(selectedSummon.status)}
              </span>
              {isUpcoming(selectedSummon.scheduledDate) && (
                <span className="flex items-center gap-1 text-[#FFD700]">
                  <Bell className="w-4 h-4" />
                  Próxima
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <Clock className="w-5 h-5 text-[#00FF41]" />
                <span>{formatDateTime(selectedSummon.scheduledDate)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <Users className="w-5 h-5 text-[#00FF41]" />
                <span>
                  {selectedSummon.confirmedPlayers.length} confirmados de {selectedSummon.invitedPlayers.length} convidados
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-[#1A1A1A] rounded border border-[#333333]">
              <p className="text-[#CCCCCC] whitespace-pre-wrap">{selectedSummon.message}</p>
            </div>
            
            {userRole === 'player' && selectedSummon.status === 'pending' && isUpcoming(selectedSummon.scheduledDate) && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleConfirm(selectedSummon.id)}
                  variant={selectedSummon.confirmedPlayers.includes(currentUserId) ? 'primary' : 'secondary'}
                >
                  <Check className="w-4 h-4" />
                  Confirmar Presença
                </Button>
                <Button
                  onClick={() => handleDecline(selectedSummon.id)}
                  variant="danger"
                >
                  <X className="w-4 h-4" />
                  Recusar
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
