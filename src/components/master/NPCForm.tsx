import React, { useState } from 'react'
import { NPC } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save } from 'lucide-react'

interface NPCFormProps {
  npc?: NPC
  campaignId: string
  masterId: string
  onSave: (npc: Partial<NPC>) => Promise<void>
  onCancel: () => void
}

export function NPCForm({ npc, campaignId, masterId, onSave, onCancel }: NPCFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<NPC>>(npc || {
    name: '',
    description: '',
    affiliation: '',
    rank: '',
    age: undefined,
    appearance: '',
    attributes: {},
    skills: [],
    relationships: [],
    history: '',
    notes: '',
    status: 'alive'
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.affiliation) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    setLoading(true)
    
    try {
      const npcData: Partial<NPC> = {
        ...formData,
        campaignId,
        masterId
      }
      
      await onSave(npcData)
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar NPC')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onCancel} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Cancelar
          </Button>
          <h1 className="text-[#FF00FF]">
            {npc ? 'Editar NPC' : 'Novo NPC'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <h2 className="text-[#FF00FF] mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome *"
                placeholder="Nome do NPC"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                label="Afiliação *"
                placeholder="Ex: Tower - Divisão de Pesquisa"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                required
              />
              
              <Input
                label="Patente/Cargo"
                placeholder="Ex: Diretora de Pesquisa"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
              
              <Input
                type="number"
                label="Idade"
                placeholder="Idade do NPC"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                min={18}
                max={200}
              />
              
              <div className="md:col-span-2">
                <label className="text-[#FF00FF] block mb-2">Descrição *</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF00FF] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                  placeholder="Descrição física e comportamental do NPC..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-[#FF00FF] block mb-2">Aparência</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF00FF] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                  placeholder="Descrição detalhada da aparência..."
                  rows={3}
                  value={formData.appearance}
                  onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-[#FF00FF] block mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF00FF] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="alive">Vivo</option>
                  <option value="injured">Ferido</option>
                  <option value="mia">Desaparecido</option>
                  <option value="kia">Morto</option>
                  <option value="disappeared">Sumiu</option>
                </select>
              </div>
            </div>
          </Card>
          
          {/* História e Aparições */}
          <Card>
            <h2 className="text-[#FF00FF] mb-4">História e Aparições</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[#FF00FF] block mb-2">Histórico de Aparições</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF00FF] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                  placeholder="Quando e como esse NPC apareceu na campanha..."
                  rows={4}
                  value={formData.history}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                />
              </div>
            </div>
          </Card>
          
          {/* Notas Privadas do Mestre */}
          <Card className="border-[#FF9900]">
            <h2 className="text-[#FF9900] mb-4">Notas Privadas do Mestre</h2>
            <div>
              <label className="text-[#FF9900] block mb-2">Notas (apenas você vê)</label>
              <textarea
                className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF9900] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,153,0,0.5)]"
                placeholder="Suas notas secretas sobre este NPC, motivações, planos, etc..."
                rows={6}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </Card>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar NPC'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
