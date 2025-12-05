import React, { useState, useEffect } from 'react'
import { Document } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { FileText, Plus, Eye, Lock, Users, FolderOpen } from 'lucide-react'
import { Modal } from '../common/Modal'

interface DocumentsListProps {
  campaignId: string
  currentUserId: string
  userRole: 'player' | 'master'
  onCreateDocument?: () => void
}

export function DocumentsList({ campaignId, currentUserId, userRole, onCreateDocument }: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  useEffect(() => {
    loadDocuments()
  }, [campaignId])
  
  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await api.getDocuments(campaignId)
      // Filtrar documentos privados se for jogador
      const filtered = userRole === 'player' 
        ? data.filter(doc => !doc.isPrivate || doc.sharedWith.includes(currentUserId))
        : data
      setDocuments(filtered)
    } catch (error) {
      alert('Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }
  
  const categories = [...new Set(documents.map(d => d.category))]
  const filteredDocs = filterCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === filterCategory)
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      lore: 'text-[#00FF41] border-[#00FF41]',
      rules: 'text-[#00DDFF] border-[#00DDFF]',
      notes: 'text-[#FF00FF] border-[#FF00FF]',
      other: 'text-[#FFFFFF] border-[#FFFFFF]'
    }
    return colors[category] || colors.other
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-[#00FF41]">Carregando documentos...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-[#00FF41]">Documentação</h2>
        </div>
        {userRole === 'master' && onCreateDocument && (
          <Button onClick={onCreateDocument} size="sm">
            <Plus className="w-4 h-4" />
            Novo Documento
          </Button>
        )}
      </div>
      
      {/* Filtros de Categoria */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setFilterCategory('all')}
            variant={filterCategory === 'all' ? 'primary' : 'ghost'}
            size="sm"
          >
            Todos ({documents.length})
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? 'primary' : 'ghost'}
              size="sm"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({documents.filter(d => d.category === cat).length})
            </Button>
          ))}
        </div>
      )}
      
      {filteredDocs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <p className="text-[#999999] mb-4">
              {filterCategory === 'all' ? 'Nenhum documento disponível' : `Nenhum documento em "${filterCategory}"`}
            </p>
            {userRole === 'master' && onCreateDocument && filterCategory === 'all' && (
              <Button onClick={onCreateDocument} size="sm">
                Criar Primeiro Documento
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:border-[#00FF41] transition-all"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <FileText className="w-5 h-5 text-[#00FF41] flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs border rounded ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                    {doc.isPrivate && (
                      <Lock className="w-4 h-4 text-[#999999]" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-white">{doc.title}</h3>
                
                <p className="text-sm text-[#999999] line-clamp-3">
                  {doc.content.substring(0, 150)}...
                </p>
                
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-[#1A1A1A] text-[#00FF41] text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-xs text-[#999999]">+{doc.tags.length - 3}</span>
                    )}
                  </div>
                )}
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDoc(doc)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <Eye className="w-4 h-4" />
                  Ler
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de Leitura */}
      {selectedDoc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 border rounded ${getCategoryColor(selectedDoc.category)}`}>
                {selectedDoc.category}
              </span>
              {selectedDoc.isPrivate ? (
                <span className="flex items-center gap-1 text-[#999999] text-sm">
                  <Lock className="w-4 h-4" />
                  Privado (Mestre)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#999999] text-sm">
                  <Users className="w-4 h-4" />
                  Compartilhado com jogadores
                </span>
              )}
            </div>
            
            {selectedDoc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDoc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#1A1A1A] text-[#00FF41] text-xs rounded border border-[#333333]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              <div
                className="text-[#CCCCCC] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: selectedDoc.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
