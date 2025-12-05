import React, { useState } from 'react'
import { Document } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ArrowLeft, Save, Lock, Users } from 'lucide-react'

interface DocumentFormProps {
  campaignId: string
  masterId: string
  onSave: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function DocumentForm({ campaignId, masterId, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'lore',
    tags: '',
    isPrivate: false
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
    
    const document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
      campaignId,
      masterId,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: tagsArray,
      isPrivate: formData.isPrivate,
      sharedWith: [] // Em produção, permitir selecionar jogadores específicos
    }
    
    onSave(document)
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
            <h2 className="text-[#00FF41] text-2xl mb-6">Novo Documento</h2>
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
              placeholder="Ex: Divisões da Tower"
              error={errors.title}
            />
          </div>
          
          {/* Categoria */}
          <div>
            <label className="block text-[#CCCCCC] mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FF41] rounded text-white focus:outline-none focus:border-[#33FF66]"
            >
              <option value="lore">Lore (História do Mundo)</option>
              <option value="rules">Regras (Mecânicas)</option>
              <option value="notes">Anotações (Privadas)</option>
              <option value="locations">Locais</option>
              <option value="factions">Facções</option>
              <option value="other">Outro</option>
            </select>
            <p className="text-[#999999] text-sm mt-1">
              Escolha a categoria para organizar melhor seus documentos
            </p>
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
              placeholder="Escreva o conteúdo do documento...

Você pode usar marcação básica:
# Título Principal
## Subtítulo
### Seção

- Lista
- De itens

**Texto em negrito**
*Texto em itálico*"
              className="w-full h-96 px-4 py-3 bg-[#0A0A0A] border border-[#00FF41] rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#33FF66] resize-vertical font-mono"
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
              placeholder="tower, divisões, organização (separadas por vírgula)"
            />
            <p className="text-[#999999] text-sm mt-1">
              Use tags para facilitar a busca depois
            </p>
          </div>
          
          {/* Privacidade */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="shared"
                name="privacy"
                checked={!formData.isPrivate}
                onChange={() => setFormData({ ...formData, isPrivate: false })}
                className="mt-1 w-4 h-4"
              />
              <label htmlFor="shared" className="cursor-pointer">
                <div className="flex items-center gap-2 text-[#CCCCCC] mb-1">
                  <Users className="w-4 h-4" />
                  <span>Compartilhado com jogadores</span>
                </div>
                <p className="text-[#999999] text-sm">
                  Todos os jogadores da campanha poderão ver este documento
                </p>
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="private"
                name="privacy"
                checked={formData.isPrivate}
                onChange={() => setFormData({ ...formData, isPrivate: true })}
                className="mt-1 w-4 h-4"
              />
              <label htmlFor="private" className="cursor-pointer">
                <div className="flex items-center gap-2 text-[#CCCCCC] mb-1">
                  <Lock className="w-4 h-4" />
                  <span>Privado (apenas mestre)</span>
                </div>
                <p className="text-[#999999] text-sm">
                  Apenas você poderá ver este documento. Ideal para plots secretos e anotações
                </p>
              </label>
            </div>
          </div>
          
          {/* Dica */}
          <div className={`p-4 rounded border ${
            formData.isPrivate 
              ? 'bg-[#FFD700]/10 border-[#FFD700]/30' 
              : 'bg-[#00FF41]/10 border-[#00FF41]/30'
          }`}>
            <p className="text-[#CCCCCC] text-sm">
              {formData.isPrivate ? (
                <>
                  🔒 <strong>Documento Privado:</strong> Use para anotações sobre plots futuros, 
                  segredos de NPCs, twists planejados
                </>
              ) : (
                <>
                  📖 <strong>Documento Compartilhado:</strong> Use para lore do mundo, regras 
                  customizadas, informações sobre locais e facções
                </>
              )}
            </p>
          </div>
          
          {/* Botões */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              Salvar Documento
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
