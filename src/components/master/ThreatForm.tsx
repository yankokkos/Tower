import React, { useState } from 'react'
import { Threat } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

interface ThreatFormProps {
  threat?: Threat
  campaignId: string
  masterId: string
  onSave: (threat: Partial<Threat>) => Promise<void>
  onCancel: () => void
}

export function ThreatForm({ threat, campaignId, masterId, onSave, onCancel }: ThreatFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Threat>>(threat || {
    name: '',
    code: '',
    type: 'entity',
    originPlane: '',
    description: '',
    capabilities: [],
    weaknesses: [],
    combatStats: {
      pv: 50,
      pvMax: 50,
      defense: 5,
      attacks: []
    },
    containmentLevel: 'safe',
    dangerLevel: 'low',
    status: 'to_capture',
    location: '',
    containmentProcedures: '',
    incidents: [],
    notes: ''
  })
  
  const [newCapability, setNewCapability] = useState('')
  const [newWeakness, setNewWeakness] = useState('')
  const [newAttack, setNewAttack] = useState({ name: '', damage: '', type: '', description: '' })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code || !formData.description) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    setLoading(true)
    
    try {
      const threatData: Partial<Threat> = {
        ...formData,
        campaignId,
        masterId,
        discoveryDate: threat?.discoveryDate || new Date()
      }
      
      await onSave(threatData)
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar ameaça')
    } finally {
      setLoading(false)
    }
  }
  
  const addCapability = () => {
    if (!newCapability) return
    setFormData({
      ...formData,
      capabilities: [...(formData.capabilities || []), newCapability]
    })
    setNewCapability('')
  }
  
  const removeCapability = (index: number) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities?.filter((_, i) => i !== index)
    })
  }
  
  const addWeakness = () => {
    if (!newWeakness) return
    setFormData({
      ...formData,
      weaknesses: [...(formData.weaknesses || []), newWeakness]
    })
    setNewWeakness('')
  }
  
  const removeWeakness = (index: number) => {
    setFormData({
      ...formData,
      weaknesses: formData.weaknesses?.filter((_, i) => i !== index)
    })
  }
  
  const addAttack = () => {
    if (!newAttack.name) return
    setFormData({
      ...formData,
      combatStats: {
        ...formData.combatStats!,
        attacks: [...formData.combatStats!.attacks, newAttack]
      }
    })
    setNewAttack({ name: '', damage: '', type: '', description: '' })
  }
  
  const removeAttack = (index: number) => {
    setFormData({
      ...formData,
      combatStats: {
        ...formData.combatStats!,
        attacks: formData.combatStats!.attacks.filter((_, i) => i !== index)
      }
    })
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onCancel} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Cancelar
          </Button>
          <h1 className="text-[#FF0033]">
            {threat ? 'Editar Ameaça' : 'Nova Ameaça'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="border-[#FF0033]">
            <h2 className="text-[#FF0033] mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome da Ameaça *"
                placeholder="Ex: Sussurro das Sombras"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-[#FF0033]"
              />
              
              <Input
                label="Código de Classificação *"
                placeholder="Ex: AM-TWR-2024-KETER-3"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="border-[#FF0033]"
              />
              
              <div>
                <label className="text-[#FF0033] block mb-2">Tipo</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF0033] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="creature">Criatura</option>
                  <option value="entity">Entidade</option>
                  <option value="anomaly">Anomalia</option>
                  <option value="artifact">Artefato</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <Input
                label="Plano de Origem"
                placeholder="Ex: Plano da Discórdia"
                value={formData.originPlane}
                onChange={(e) => setFormData({ ...formData, originPlane: e.target.value })}
                className="border-[#FF0033]"
              />
              
              <div className="md:col-span-2">
                <label className="text-[#FF0033] block mb-2">Descrição *</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF0033] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                  placeholder="Descrição física e comportamental da ameaça..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>
          
          {/* Classificação */}
          <Card className="border-[#FF0033]">
            <h2 className="text-[#FF0033] mb-4">Classificação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#FF0033] block mb-2">Nível de Contenção</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF0033] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                  value={formData.containmentLevel}
                  onChange={(e) => setFormData({ ...formData, containmentLevel: e.target.value as any })}
                >
                  <option value="safe">Safe (Seguro)</option>
                  <option value="eucalipto">Eucalipto (Observação)</option>
                  <option value="keter">Keter (Perigoso)</option>
                  <option value="apollyon">Apollyon (Catastrófico)</option>
                </select>
              </div>
              
              <div>
                <label className="text-[#FF0033] block mb-2">Nível de Perigo</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF0033] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                  value={formData.dangerLevel}
                  onChange={(e) => setFormData({ ...formData, dangerLevel: e.target.value as any })}
                >
                  <option value="low">Baixo</option>
                  <option value="medium">Médio</option>
                  <option value="high">Alto</option>
                  <option value="critical">Crítico</option>
                </select>
              </div>
              
              <div>
                <label className="text-[#FF0033] block mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF0033] text-white rounded focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="to_capture">A Capturar</option>
                  <option value="supervised">Sob Supervisão</option>
                  <option value="contained">Contido</option>
                  <option value="eliminated">Eliminado</option>
                </select>
              </div>
              
              <Input
                label="Localização Atual"
                placeholder="Ex: Centro de São Paulo"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-[#FF0033]"
              />
            </div>
          </Card>
          
          {/* Capacidades */}
          <Card className="border-[#FF0033]">
            <h2 className="text-[#FF0033] mb-4">Capacidades</h2>
            
            {formData.capabilities && formData.capabilities.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.capabilities.map((cap, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1A1A1A] rounded p-3 border border-[#FF0033]/50">
                    <p className="text-white">{cap}</p>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeCapability(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <Input
                placeholder="Nova capacidade..."
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                className="border-[#FF0033] flex-1"
              />
              <Button type="button" onClick={addCapability} variant="danger" size="sm">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </Card>
          
          {/* Fraquezas */}
          <Card className="border-[#00FF41]">
            <h2 className="text-[#00FF41] mb-4">Fraquezas</h2>
            
            {formData.weaknesses && formData.weaknesses.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.weaknesses.map((weak, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                    <p className="text-white">{weak}</p>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeWeakness(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <Input
                placeholder="Nova fraqueza..."
                value={newWeakness}
                onChange={(e) => setNewWeakness(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addWeakness} size="sm">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </Card>
          
          {/* Stats de Combate */}
          <Card className="border-[#FF0033]">
            <h2 className="text-[#FF0033] mb-4">Estatísticas de Combate</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                type="number"
                label="PV"
                value={formData.combatStats?.pv}
                onChange={(e) => setFormData({
                  ...formData,
                  combatStats: {
                    ...formData.combatStats!,
                    pv: parseInt(e.target.value) || 0,
                    pvMax: parseInt(e.target.value) || 0
                  }
                })}
                className="border-[#FF0033]"
              />
              <Input
                type="number"
                label="Defesa"
                value={formData.combatStats?.defense}
                onChange={(e) => setFormData({
                  ...formData,
                  combatStats: {
                    ...formData.combatStats!,
                    defense: parseInt(e.target.value) || 0
                  }
                })}
                className="border-[#FF0033]"
              />
            </div>
            
            <h3 className="text-[#FF0033] mb-3">Ataques</h3>
            
            {formData.combatStats?.attacks && formData.combatStats.attacks.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.combatStats.attacks.map((attack, index) => (
                  <div key={index} className="bg-[#1A1A1A] rounded p-3 border border-[#FF0033]/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white">{attack.name}</p>
                        <p className="text-[#999999]">Dano: {attack.damage} | Tipo: {attack.type}</p>
                        {attack.description && <p className="text-[#CCCCCC] text-sm">{attack.description}</p>}
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAttack(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Input
                placeholder="Nome do ataque"
                value={newAttack.name}
                onChange={(e) => setNewAttack({ ...newAttack, name: e.target.value })}
                className="border-[#FF0033]"
              />
              <Input
                placeholder="Dano (ex: 2d10+5)"
                value={newAttack.damage}
                onChange={(e) => setNewAttack({ ...newAttack, damage: e.target.value })}
                className="border-[#FF0033]"
              />
              <Input
                placeholder="Tipo"
                value={newAttack.type}
                onChange={(e) => setNewAttack({ ...newAttack, type: e.target.value })}
                className="border-[#FF0033]"
              />
              <Input
                placeholder="Descrição"
                value={newAttack.description || ''}
                onChange={(e) => setNewAttack({ ...newAttack, description: e.target.value })}
                className="border-[#FF0033]"
              />
              <Button type="button" onClick={addAttack} variant="danger" size="sm">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </Card>
          
          {/* Procedimentos de Contenção */}
          <Card className="border-[#FF9900]">
            <h2 className="text-[#FF9900] mb-4">Procedimentos de Contenção</h2>
            <textarea
              className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#FF9900] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(255,153,0,0.5)]"
              placeholder="Como conter ou neutralizar esta ameaça..."
              rows={6}
              value={formData.containmentProcedures}
              onChange={(e) => setFormData({ ...formData, containmentProcedures: e.target.value })}
            />
          </Card>
          
          {/* Notas do Mestre */}
          <Card className="border-[#00DDFF]">
            <h2 className="text-[#00DDFF] mb-4">Notas do Mestre</h2>
            <textarea
              className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00DDFF] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,221,255,0.5)]"
              placeholder="Suas notas privadas sobre esta ameaça..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Card>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Ameaça'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
