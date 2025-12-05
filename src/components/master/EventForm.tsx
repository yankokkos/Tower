import React, { useState, useEffect } from 'react'
import { CampaignEvent, Character, NPC, Threat } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save, Target, HelpCircle, Skull, Trophy, Clock } from 'lucide-react'

interface EventFormProps {
  campaignId: string
  masterId: string
  onSave: (event: Omit<CampaignEvent, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function EventForm({ campaignId, masterId, onSave, onCancel }: EventFormProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [npcs, setNPCs] = useState<NPC[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mission' as CampaignEvent['type'],
    date: new Date().toISOString().split('T')[0],
    relatedCharacters: [] as string[],
    relatedNPCs: [] as string[],
    relatedThreats: [] as string[]
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    loadRelatedEntities()
  }, [campaignId])
  
  const loadRelatedEntities = async () => {
    try {
      const [charsData, npcsData, threatsData] = await Promise.all([
        api.getCharacters(campaignId),
        api.getNPCs(campaignId),
        api.getThreats(campaignId)
      ])
      setCharacters(charsData)
      setNPCs(npcsData)
      setThreats(threatsData)
    } catch (error) {
      console.error('Erro ao carregar entidades:', error)
    }
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
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter no mínimo 10 caracteres'
    }
    
    if (!formData.date) {
      newErrors.date = 'Data é obrigatória'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const event: Omit<CampaignEvent, 'id' | 'createdAt'> = {
      campaignId,
      masterId,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      date: new Date(formData.date),
      relatedCharacters: formData.relatedCharacters.length > 0 ? formData.relatedCharacters : undefined,
      relatedNPCs: formData.relatedNPCs.length > 0 ? formData.relatedNPCs : undefined,
      relatedThreats: formData.relatedThreats.length > 0 ? formData.relatedThreats : undefined
    }
    
    onSave(event)
  }
  
  const eventTypes = [
    { value: 'mission', label: 'Missão', icon: Target, color: 'text-[#00FF41]' },
    { value: 'discovery', label: 'Descoberta', icon: HelpCircle, color: 'text-[#00DDFF]' },
    { value: 'death', label: 'Morte', icon: Skull, color: 'text-[#FF0033]' },
    { value: 'achievement', label: 'Conquista', icon: Trophy, color: 'text-[#FFD700]' },
    { value: 'other', label: 'Outro', icon: Clock, color: 'text-[#FFFFFF]' }
  ]
  
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
            <h2 className="text-[#00FF41] text-2xl mb-6">Novo Evento na Timeline</h2>
          </div>
          
          {/* Tipo */}
          <div>
            <label className="block text-[#CCCCCC] mb-3">
              Tipo de Evento *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {eventTypes.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: value as CampaignEvent['type'] })}
                  className={`
                    p-4 rounded border transition-all flex flex-col items-center gap-2
                    ${formData.type === value
                      ? `${color} border-current bg-current/10`
                      : 'text-[#999999] border-[#333333] hover:border-[#666666]'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
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
              placeholder="Ex: Descoberta do Sussurro das Sombras"
              error={errors.title}
            />
          </div>
          
          {/* Data */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Data do Evento *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value })
                setErrors({ ...errors, date: '' })
              }}
              error={errors.date}
            />
            <p className="text-[#999999] text-sm mt-1">
              Data em que o evento aconteceu na cronologia da campanha
            </p>
          </div>
          
          {/* Descrição */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                setErrors({ ...errors, description: '' })
              }}
              placeholder="Descreva o que aconteceu neste evento...

Seja breve mas informativo. Esta descrição aparecerá na timeline da campanha."
              className="w-full h-32 px-4 py-3 bg-[#0A0A0A] border border-[#00FF41] rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#33FF66] resize-vertical"
            />
            {errors.description && (
              <p className="text-[#FF0033] text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          {/* Personagens Relacionados */}
          {characters.length > 0 && (
            <div>
              <label className="block text-[#CCCCCC] mb-3">
                Personagens Envolvidos (opcional)
              </label>
              <div className="space-y-2">
                {characters.map(char => (
                  <label
                    key={char.id}
                    className={`
                      flex items-center gap-3 p-3 rounded border cursor-pointer transition-all
                      ${formData.relatedCharacters.includes(char.id)
                        ? 'bg-[#00FF41]/10 border-[#00FF41]'
                        : 'bg-[#1A1A1A] border-[#333333] hover:border-[#00FF41]/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={formData.relatedCharacters.includes(char.id)}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          relatedCharacters: e.target.checked
                            ? [...prev.relatedCharacters, char.id]
                            : prev.relatedCharacters.filter(id => id !== char.id)
                        }))
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-white">{char.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* NPCs Relacionados */}
          {npcs.length > 0 && (
            <div>
              <label className="block text-[#CCCCCC] mb-3">
                NPCs Envolvidos (opcional)
              </label>
              <div className="space-y-2">
                {npcs.map(npc => (
                  <label
                    key={npc.id}
                    className={`
                      flex items-center gap-3 p-3 rounded border cursor-pointer transition-all
                      ${formData.relatedNPCs.includes(npc.id)
                        ? 'bg-[#00DDFF]/10 border-[#00DDFF]'
                        : 'bg-[#1A1A1A] border-[#333333] hover:border-[#00DDFF]/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={formData.relatedNPCs.includes(npc.id)}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          relatedNPCs: e.target.checked
                            ? [...prev.relatedNPCs, npc.id]
                            : prev.relatedNPCs.filter(id => id !== npc.id)
                        }))
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-white">{npc.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Ameaças Relacionadas */}
          {threats.length > 0 && (
            <div>
              <label className="block text-[#CCCCCC] mb-3">
                Ameaças Envolvidas (opcional)
              </label>
              <div className="space-y-2">
                {threats.map(threat => (
                  <label
                    key={threat.id}
                    className={`
                      flex items-center gap-3 p-3 rounded border cursor-pointer transition-all
                      ${formData.relatedThreats.includes(threat.id)
                        ? 'bg-[#FF0033]/10 border-[#FF0033]'
                        : 'bg-[#1A1A1A] border-[#333333] hover:border-[#FF0033]/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={formData.relatedThreats.includes(threat.id)}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          relatedThreats: e.target.checked
                            ? [...prev.relatedThreats, threat.id]
                            : prev.relatedThreats.filter(id => id !== threat.id)
                        }))
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-white">{threat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Info */}
          <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded">
            <p className="text-[#CCCCCC] text-sm">
              ℹ️ Este evento aparecerá na timeline da campanha em ordem cronológica. 
              Use para registrar momentos importantes da história!
            </p>
          </div>
          
          {/* Botões */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              Registrar Evento
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
