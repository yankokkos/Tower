import React, { useState, useEffect } from 'react'
import { Summon, User } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save, Users } from 'lucide-react'

interface SummonFormProps {
  campaignId: string
  masterId: string
  onSave: (summon: Omit<Summon, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function SummonForm({ campaignId, masterId, onSave, onCancel }: SummonFormProps) {
  const [players, setPlayers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    scheduledDate: '',
    scheduledTime: '19:00',
    invitedPlayers: [] as string[]
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    loadPlayers()
  }, [])
  
  const loadPlayers = async () => {
    try {
      // Nota: getUsers não existe na API, seria necessário criar endpoint ou buscar de outra forma
      // Por enquanto, deixar vazio - os jogadores serão selecionados manualmente via IDs
      // Em produção, seria necessário criar endpoint GET /api/v1/users ou buscar via campanha
      setPlayers([])
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error)
    }
  }
  
  const handleTogglePlayer = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      invitedPlayers: prev.invitedPlayers.includes(playerId)
        ? prev.invitedPlayers.filter(id => id !== playerId)
        : [...prev.invitedPlayers, playerId]
    }))
    setErrors({ ...errors, invitedPlayers: '' })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter no mínimo 3 caracteres'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Mensagem deve ter no mínimo 10 caracteres'
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Data é obrigatória'
    }
    
    if (formData.invitedPlayers.length === 0) {
      newErrors.invitedPlayers = 'Convide pelo menos 1 jogador'
    }
    
    // Validar que a data não é no passado
    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
    if (scheduledDateTime < new Date()) {
      newErrors.scheduledDate = 'A data deve ser no futuro'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const summon: Omit<Summon, 'id' | 'createdAt' | 'updatedAt'> = {
      campaignId,
      masterId,
      title: formData.title,
      message: formData.message,
      scheduledDate: new Date(`${formData.scheduledDate}T${formData.scheduledTime}`),
      invitedPlayers: formData.invitedPlayers,
      confirmedPlayers: [],
      declinedPlayers: [],
      status: 'pending',
      reminderSent: false
    }
    
    onSave(summon)
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button onClick={onCancel} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-[#00FF41] text-2xl mb-6">Nova Convocação</h2>
          </div>
          
          {/* Título */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Título *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                setErrors({ ...errors, title: '' })
              }}
              placeholder="Ex: Sessão 2 - Operação Eclipse"
              error={errors.title}
            />
          </div>
          
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CCCCCC] mb-2">
                Data *
              </label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => {
                  setFormData({ ...formData, scheduledDate: e.target.value })
                  setErrors({ ...errors, scheduledDate: '' })
                }}
                error={errors.scheduledDate}
              />
            </div>
            
            <div>
              <label className="block text-[#CCCCCC] mb-2">
                Horário *
              </label>
              <Input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>
          
          {/* Mensagem */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Mensagem *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value })
                setErrors({ ...errors, message: '' })
              }}
              placeholder="Escreva os detalhes da sessão...

Exemplo:
- Objetivos da sessão
- O que preparar
- Tempo estimado
- Observações importantes"
              className="w-full h-48 px-4 py-3 bg-[#0A0A0A] border border-[#00FF41] rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#33FF66] resize-vertical"
            />
            {errors.message && (
              <p className="text-[#FF0033] text-sm mt-1">{errors.message}</p>
            )}
          </div>
          
          {/* Jogadores Convidados */}
          <div>
            <label className="block text-[#CCCCCC] mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              Jogadores Convidados *
            </label>
            
            {players.length === 0 ? (
              <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded text-center">
                <p className="text-[#999999]">Nenhum jogador disponível</p>
              </div>
            ) : (
              <div className="space-y-2">
                {players.map(player => (
                  <label
                    key={player.id}
                    className={`
                      flex items-center gap-3 p-4 rounded border cursor-pointer transition-all
                      ${formData.invitedPlayers.includes(player.id)
                        ? 'bg-[#00FF41]/10 border-[#00FF41]'
                        : 'bg-[#1A1A1A] border-[#333333] hover:border-[#00FF41]/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={formData.invitedPlayers.includes(player.id)}
                      onChange={() => handleTogglePlayer(player.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white">{player.name}</p>
                      <p className="text-[#999999] text-sm">{player.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {errors.invitedPlayers && (
              <p className="text-[#FF0033] text-sm mt-2">{errors.invitedPlayers}</p>
            )}
            
            {formData.invitedPlayers.length > 0 && (
              <p className="text-[#00FF41] text-sm mt-2">
                {formData.invitedPlayers.length} jogador(es) selecionado(s)
              </p>
            )}
          </div>
          
          {/* Info */}
          <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded">
            <p className="text-[#CCCCCC] text-sm">
              ℹ️ Os jogadores receberão a convocação e poderão confirmar ou recusar presença
            </p>
          </div>
          
          {/* Botões */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              Criar Convocação
            </Button>
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
