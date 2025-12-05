import React, { useState, useEffect } from 'react'
import { Report } from '../../types'
import { api } from '../../services/api'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { FileText, Plus, Eye, Lock, Users, Calendar } from 'lucide-react'
import { Modal } from '../common/Modal'

interface ReportsListProps {
  campaignId: string
  currentUserId: string
  onCreateReport: () => void
}

export function ReportsList({ campaignId, currentUserId, onCreateReport }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadReports()
  }, [campaignId])
  
  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await api.getReports(campaignId)
      setReports(data)
    } catch (error) {
      alert('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }
  
  const getTypeColor = (type: Report['type']) => {
    const colors = {
      mission: 'text-[#00FF41] border-[#00FF41]',
      session: 'text-[#00DDFF] border-[#00DDFF]',
      general: 'text-[#FFFFFF] border-[#FFFFFF]',
      character: 'text-[#FF00FF] border-[#FF00FF]',
      threat: 'text-[#FF0033] border-[#FF0033]'
    }
    return colors[type] || colors.general
  }
  
  const getTypeLabel = (type: Report['type']) => {
    const labels = {
      mission: 'Missão',
      session: 'Sessão',
      general: 'Geral',
      character: 'Personagem',
      threat: 'Ameaça'
    }
    return labels[type] || 'Geral'
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-[#00FF41]">Carregando relatórios...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-[#00FF41]">Relatórios</h2>
        </div>
        <Button onClick={onCreateReport} size="sm">
          <Plus className="w-4 h-4" />
          Novo Relatório
        </Button>
      </div>
      
      {reports.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <p className="text-[#999999] mb-4">Nenhum relatório criado ainda</p>
            <Button onClick={onCreateReport} size="sm">
              Criar Primeiro Relatório
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="cursor-pointer hover:border-[#00FF41] transition-all">
              <div className="space-y-3" onClick={() => setSelectedReport(report)}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white flex-1">{report.title}</h3>
                  <span className={`px-2 py-1 text-xs border rounded ${getTypeColor(report.type)}`}>
                    {getTypeLabel(report.type)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-[#999999]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.date).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {report.isPrivate ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Privado
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        {report.sharedWith.length} jogadores
                      </>
                    )}
                  </div>
                </div>
                
                {report.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#1A1A1A] text-[#00FF41] text-xs rounded border border-[#333333]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedReport(report)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de Visualização */}
      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 border rounded ${getTypeColor(selectedReport.type)}`}>
                {getTypeLabel(selectedReport.type)}
              </span>
              <span className="text-[#999999]">
                {new Date(selectedReport.date).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1 text-[#999999]">
                {selectedReport.isPrivate ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Privado
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Compartilhado
                  </>
                )}
              </span>
            </div>
            
            {selectedReport.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedReport.tags.map((tag, idx) => (
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
                dangerouslySetInnerHTML={{ __html: selectedReport.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
