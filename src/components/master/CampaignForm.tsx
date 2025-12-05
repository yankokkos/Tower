import React, { useState } from 'react'
import { Campaign } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save } from 'lucide-react'

interface CampaignFormProps {
  campaign?: Campaign
  masterId: string
  onSave: (campaign: Partial<Campaign>) => Promise<void>
  onCancel: () => void
}

export function CampaignForm({ campaign, masterId, onSave, onCancel }: CampaignFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Campaign>>(campaign || {
    name: '',
    description: '',
    status: 'active'
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    if (formData.name.length < 3) {
      alert('O nome da campanha deve ter no mínimo 3 caracteres')
      return
    }
    
    setLoading(true)
    
    try {
      const campaignData: Partial<Campaign> = {
        ...formData,
        masterId
      }
      
      await onSave(campaignData)
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar campanha')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onCancel} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Cancelar
          </Button>
          <h1 className="text-[#00FF41]">
            {campaign ? 'Editar Campanha' : 'Nova Campanha'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Campanha */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Informações da Campanha</h2>
            <div className="space-y-4">
              <Input
                label="Nome da Campanha *"
                placeholder="Ex: Operação Eclipse"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <div>
                <label className="text-[#00FF41] block mb-2">Descrição *</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  placeholder="Descreva a premissa e objetivos da campanha..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="text-[#00FF41] block mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Ativa</option>
                  <option value="paused">Pausada</option>
                  <option value="completed">Concluída</option>
                  <option value="archived">Arquivada</option>
                </select>
              </div>
            </div>
          </Card>
          
          {/* Dicas */}
          <Card className="border-[#00DDFF]">
            <h3 className="text-[#00DDFF] mb-3">Dicas para criar uma boa campanha</h3>
            <ul className="space-y-2 text-[#CCCCCC]">
              <li>• Defina uma premissa clara e intrigante</li>
              <li>• Pense em ameaças e mistérios que os jogadores vão enfrentar</li>
              <li>• Crie NPCs importantes com motivações próprias</li>
              <li>• Estabeleça uma progressão de dificuldade</li>
              <li>• Prepare eventos que podem mudar o rumo da história</li>
            </ul>
          </Card>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Campanha'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
