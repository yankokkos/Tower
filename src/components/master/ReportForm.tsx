import React, { useState } from 'react'
import { Report } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save } from 'lucide-react'

interface ReportFormProps {
  campaignId: string
  masterId: string
  onSave: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function ReportForm({ campaignId, masterId, onSave, onCancel }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'session' as Report['type'],
    date: new Date().toISOString().split('T')[0],
    tags: '',
    isPrivate: false,
    sharedWith: [] as string[]
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter no mínimo 3 caracteres'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório'
    } else if (formData.content.length < 10) {
      newErrors.content = 'Conteúdo deve ter no mínimo 10 caracteres'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Processar tags
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    const report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'> = {
      campaignId,
      masterId,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      date: new Date(formData.date),
      tags: tagsArray,
      isPrivate: formData.isPrivate,
      sharedWith: formData.sharedWith
    }
    
    onSave(report)
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
            <h2 className="text-[#00FF41] text-2xl mb-6">Novo Relatório</h2>
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
              placeholder="Ex: Relatório da Sessão 1 - Operação Eclipse"
              error={errors.title}
            />
          </div>
          
          {/* Tipo */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Tipo *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Report['type'] })}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FF41] rounded text-white focus:outline-none focus:border-[#33FF66]"
            >
              <option value="session">Sessão</option>
              <option value="mission">Missão</option>
              <option value="threat">Ameaça</option>
              <option value="character">Personagem</option>
              <option value="general">Geral</option>
            </select>
          </div>
          
          {/* Data */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Data do Evento *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          {/* Conteúdo */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Conteúdo *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value })
                setErrors({ ...errors, content: '' })
              }}
              placeholder="Escreva o relatório detalhado aqui...

Você pode usar marcação básica:
# Título
## Subtítulo
- Lista
- De itens"
              className="w-full h-64 px-4 py-3 bg-[#0A0A0A] border border-[#00FF41] rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#33FF66] resize-vertical font-mono"
            />
            {errors.content && (
              <p className="text-[#FF0033] text-sm mt-1">{errors.content}</p>
            )}
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Tags
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="sessão, investigação, ameaça (separadas por vírgula)"
            />
            <p className="text-[#999999] text-sm mt-1">
              Separe as tags com vírgulas
            </p>
          </div>
          
          {/* Privacidade */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              className="w-4 h-4 bg-[#0A0A0A] border-[#00FF41] rounded"
            />
            <label htmlFor="isPrivate" className="text-[#CCCCCC] cursor-pointer">
              Relatório privado (apenas você poderá ver)
            </label>
          </div>
          
          {!formData.isPrivate && (
            <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded">
              <p className="text-[#CCCCCC] text-sm">
                ℹ️ Este relatório será compartilhado com todos os jogadores da campanha
              </p>
            </div>
          )}
          
          {/* Botões */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              Salvar Relatório
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
