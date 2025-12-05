import React, { useState } from 'react'
import { Character } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Heart, Brain, Zap, Plus, Minus, RefreshCw } from 'lucide-react'

interface CharacterResourceManagerProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => Promise<void>
  readOnly?: boolean
}

export function CharacterResourceManager({ character, onUpdate, readOnly = false }: CharacterResourceManagerProps) {
  const [showPvModal, setShowPvModal] = useState(false)
  const [showPsModal, setShowPsModal] = useState(false)
  const [showPeModal, setShowPeModal] = useState(false)
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const currentPv = character.statusDerived.pv
  const maxPv = character.statusDerived.pvMax
  const currentPs = character.statusDerived.ps
  const maxPs = character.statusDerived.psMax
  const currentPe = character.statusDerived.pe
  const maxPe = character.statusDerived.peMax
  
  const pvPercentage = (currentPv / maxPv) * 100
  const psPercentage = (currentPs / maxPs) * 100
  const pePercentage = (currentPe / maxPe) * 100
  
  const handleUpdateResource = async (type: 'pv' | 'ps' | 'pe', change: number) => {
    setLoading(true)
    try {
      const newValue = Math.max(0, Math.min(
        character.statusDerived[type] + change,
        character.statusDerived[`${type}Max` as keyof typeof character.statusDerived] as number
      ))
      
      await onUpdate({
        statusDerived: {
          ...character.statusDerived,
          [type]: newValue
        }
      })
      
      setAmount(0)
      setShowPvModal(false)
      setShowPsModal(false)
      setShowPeModal(false)
    } catch (error) {
      alert('Erro ao atualizar recurso')
    } finally {
      setLoading(false)
    }
  }
  
  const handleFullRestore = async () => {
    if (readOnly) return
    
    setLoading(true)
    try {
      await onUpdate({
        statusDerived: {
          ...character.statusDerived,
          pv: character.statusDerived.pvMax,
          ps: character.statusDerived.psMax,
          pe: character.statusDerived.peMax
        }
      })
      alert('Recursos restaurados!')
    } catch (error) {
      alert('Erro ao restaurar recursos')
    } finally {
      setLoading(false)
    }
  }
  
  const getHealthColor = (percentage: number) => {
    if (percentage > 75) return '#00FF41'
    if (percentage > 50) return '#FFD700'
    if (percentage > 25) return '#FF9900'
    return '#FF0033'
  }
  
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#00FF41]">Recursos</h3>
        {!readOnly && (
          <Button 
            onClick={handleFullRestore} 
            variant="secondary" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
            Restaurar Tudo
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* PV - Pontos de Vida */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF0033]" />
              <span className="text-white">Pontos de Vida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00FF41] text-xl">{currentPv}</span>
              <span className="text-[#999999]">/ {maxPv}</span>
              {!readOnly && (
                <Button 
                  onClick={() => setShowPvModal(true)} 
                  variant="ghost" 
                  size="sm"
                >
                  Modificar
                </Button>
              )}
            </div>
          </div>
          <div className="w-full bg-[#1A1A1A] rounded-full h-3 border border-[#333333]">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${pvPercentage}%`,
                backgroundColor: getHealthColor(pvPercentage),
                boxShadow: `0 0 10px ${getHealthColor(pvPercentage)}`
              }}
            />
          </div>
        </div>
        
        {/* PS - Pontos Simbólicos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#00DDFF]" />
              <span className="text-white">Pontos Simbólicos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00DDFF] text-xl">{currentPs}</span>
              <span className="text-[#999999]">/ {maxPs}</span>
              {!readOnly && (
                <Button 
                  onClick={() => setShowPsModal(true)} 
                  variant="ghost" 
                  size="sm"
                >
                  Modificar
                </Button>
              )}
            </div>
          </div>
          <div className="w-full bg-[#1A1A1A] rounded-full h-3 border border-[#333333]">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${psPercentage}%`,
                backgroundColor: '#00DDFF',
                boxShadow: '0 0 10px rgba(0, 221, 255, 0.7)'
              }}
            />
          </div>
        </div>
        
        {/* PE - Pontos de Energia */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF00FF]" />
              <span className="text-white">Pontos de Energia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF00FF] text-xl">{currentPe}</span>
              <span className="text-[#999999]">/ {maxPe}</span>
              {!readOnly && (
                <Button 
                  onClick={() => setShowPeModal(true)} 
                  variant="ghost" 
                  size="sm"
                >
                  Modificar
                </Button>
              )}
            </div>
          </div>
          <div className="w-full bg-[#1A1A1A] rounded-full h-3 border border-[#333333]">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${pePercentage}%`,
                backgroundColor: '#FF00FF',
                boxShadow: '0 0 10px rgba(255, 0, 255, 0.7)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Modal PV */}
      {showPvModal && (
        <Modal
          isOpen={showPvModal}
          onClose={() => setShowPvModal(false)}
          title="Modificar Pontos de Vida"
        >
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[#999999] mb-2">PV Atual</p>
              <p className="text-[#00FF41] text-3xl">{currentPv} / {maxPv}</p>
            </div>
            
            <Input
              type="number"
              label="Quantidade"
              placeholder="Ex: 10 (positivo cura, negativo dano)"
              value={amount || ''}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleUpdateResource('pv', -Math.abs(amount))}
                variant="danger"
                disabled={loading || amount === 0}
              >
                <Minus className="w-4 h-4" />
                Causar Dano
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pv', Math.abs(amount))}
                disabled={loading || amount === 0}
              >
                <Plus className="w-4 h-4" />
                Curar
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpdateResource('pv', -1)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -1
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pv', -5)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -5
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pv', 1)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +1
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pv', 5)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +5
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Modal PS */}
      {showPsModal && (
        <Modal
          isOpen={showPsModal}
          onClose={() => setShowPsModal(false)}
          title="Modificar Pontos Simbólicos"
        >
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[#999999] mb-2">PS Atual</p>
              <p className="text-[#00DDFF] text-3xl">{currentPs} / {maxPs}</p>
            </div>
            
            <Input
              type="number"
              label="Quantidade"
              placeholder="Ex: 5 (positivo recupera, negativo gasta)"
              value={amount || ''}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleUpdateResource('ps', -Math.abs(amount))}
                variant="danger"
                disabled={loading || amount === 0}
              >
                <Minus className="w-4 h-4" />
                Gastar PS
              </Button>
              <Button 
                onClick={() => handleUpdateResource('ps', Math.abs(amount))}
                disabled={loading || amount === 0}
              >
                <Plus className="w-4 h-4" />
                Recuperar PS
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpdateResource('ps', -1)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -1
              </Button>
              <Button 
                onClick={() => handleUpdateResource('ps', -3)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -3
              </Button>
              <Button 
                onClick={() => handleUpdateResource('ps', 1)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +1
              </Button>
              <Button 
                onClick={() => handleUpdateResource('ps', 3)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +3
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Modal PE */}
      {showPeModal && (
        <Modal
          isOpen={showPeModal}
          onClose={() => setShowPeModal(false)}
          title="Modificar Pontos de Energia"
        >
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[#999999] mb-2">PE Atual</p>
              <p className="text-[#FF00FF] text-3xl">{currentPe} / {maxPe}</p>
            </div>
            
            <Input
              type="number"
              label="Quantidade"
              placeholder="Ex: 10 (positivo recupera, negativo gasta)"
              value={amount || ''}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleUpdateResource('pe', -Math.abs(amount))}
                variant="danger"
                disabled={loading || amount === 0}
              >
                <Minus className="w-4 h-4" />
                Gastar PE
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pe', Math.abs(amount))}
                disabled={loading || amount === 0}
              >
                <Plus className="w-4 h-4" />
                Recuperar PE
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpdateResource('pe', -2)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -2
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pe', -5)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                -5
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pe', 2)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +2
              </Button>
              <Button 
                onClick={() => handleUpdateResource('pe', 5)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                +5
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  )
}
