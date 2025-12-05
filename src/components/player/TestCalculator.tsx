import React, { useState } from 'react'
import { Character } from '../../types'
import { Card } from '../common/Card'

interface TestCalculatorProps {
  character: Character
}

export function TestCalculator({ character }: TestCalculatorProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>('forca')
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('')
  const [modifiers, setModifiers] = useState(0)
  const [difficulty, setDifficulty] = useState(10)
  
  const attributeValue = character.attributes[selectedAttribute as keyof typeof character.attributes] || 0
  
  const skill = character.skills.find(s => s.id === selectedSkill)
  const skillLevel = skill?.level || 0
  const specialization = skill?.specializations?.find(s => s.id === selectedSpecialization)
  const specializationLevel = specialization?.level || 0
  
  // Determinar número de dados
  let diceCount = 1 // Sem perícia = 1d10
  if (skillLevel > 0) {
    diceCount = 2 // Com perícia = 2d10
  }
  if (specializationLevel > 0) {
    diceCount = 3 // Com especialização = 3d10
  }
  
  // Calcular resultado esperado
  const expectedResult = attributeValue + modifiers
  const averageRoll = (diceCount * 5.5) // Média de 1d10 = 5.5
  const averageTotal = averageRoll + expectedResult
  
  // Calcular chance de sucesso (aproximada)
  // Para simplificar: se média + atributo + modificadores >= dificuldade, chance > 50%
  const successChance = averageTotal >= difficulty ? 
    Math.min(95, 50 + ((averageTotal - difficulty) * 5)) : 
    Math.max(5, 50 - ((difficulty - averageTotal) * 5))
  
  // Fórmula completa
  const formula = `${diceCount}d10 + ${attributeValue}${modifiers !== 0 ? (modifiers > 0 ? ` + ${modifiers}` : ` ${modifiers}`) : ''} vs ${difficulty}`
  
  // Efeitos de crítico
  const criticalFailure = diceCount === 1 // 1 = falha crítica apenas com 1d10
  const criticalSuccess = true // 10 = sucesso crítico sempre
  
  return (
    <Card>
      <h2 className="text-[#00FF41] mb-4">Calculadora de Testes (Sistema 10X)</h2>
      
      <div className="space-y-4">
        {/* Seleção de Atributo */}
        <div>
          <label className="text-[#00FF41] block mb-2">Atributo Base *</label>
          <select
            className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
            value={selectedAttribute}
            onChange={(e) => {
              setSelectedAttribute(e.target.value)
              setSelectedSkill('')
              setSelectedSpecialization('')
            }}
          >
            {Object.keys(character.attributes).map(attr => (
              <option key={attr} value={attr}>
                {attr.charAt(0).toUpperCase() + attr.slice(1)} ({character.attributes[attr as keyof typeof character.attributes]})
              </option>
            ))}
          </select>
        </div>
        
        {/* Seleção de Perícia */}
        <div>
          <label className="text-[#00FF41] block mb-2">Perícia (Opcional)</label>
          <select
            className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
            value={selectedSkill}
            onChange={(e) => {
              setSelectedSkill(e.target.value)
              setSelectedSpecialization('')
            }}
          >
            <option value="">Nenhuma (1d10)</option>
            {character.skills
              .filter(s => s.attribute === selectedAttribute)
              .map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} - Nível {skill.level} (2d10)
                </option>
              ))}
          </select>
        </div>
        
        {/* Seleção de Especialização */}
        {skill && skill.specializations && skill.specializations.length > 0 && (
          <div>
            <label className="text-[#00DDFF] block mb-2">Especialização (Opcional)</label>
            <select
              className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00DDFF] text-white rounded"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">Nenhuma (2d10)</option>
              {skill.specializations.map(spec => (
                <option key={spec.id} value={spec.id}>
                  {spec.name} - Nível {spec.level} (3d10)
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Modificadores */}
        <div>
          <label className="text-[#00FF41] block mb-2">Modificadores Adicionais</label>
          <input
            type="number"
            className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
            value={modifiers}
            onChange={(e) => setModifiers(parseInt(e.target.value) || 0)}
          />
          <p className="text-[#999999] text-xs mt-1">Valores positivos para bônus, negativos para penalidades</p>
        </div>
        
        {/* Dificuldade */}
        <div>
          <label className="text-[#00FF41] block mb-2">Dificuldade Alvo</label>
          <input
            type="number"
            className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value) || 10)}
            min={1}
            max={30}
          />
        </div>
        
        {/* Resultado */}
        <div className="bg-[#0A0A0A] rounded p-4 border border-[#00FF41]/50 space-y-3">
          <div>
            <p className="text-[#999999] text-sm mb-1">Fórmula Completa</p>
            <p className="text-[#00FF41] font-mono">{formula}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#999999] text-sm mb-1">Dados</p>
              <p className="text-[#00DDFF] text-xl font-bold">{diceCount}d10</p>
            </div>
            <div>
              <p className="text-[#999999] text-sm mb-1">Modificador Total</p>
              <p className="text-[#00FF41] text-xl font-bold">
                {expectedResult > 0 ? '+' : ''}{expectedResult}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-[#999999] text-sm mb-1">Resultado Esperado (Média)</p>
            <p className="text-[#FF00FF] text-2xl font-bold">{Math.round(averageTotal)}</p>
          </div>
          
          <div>
            <p className="text-[#999999] text-sm mb-1">Chance de Sucesso (Aproximada)</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#1A1A1A] rounded-full h-4 border border-[#00FF41]">
                <div 
                  className="bg-[#00FF41] h-full rounded-full transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, successChance))}%` }}
                />
              </div>
              <span className="text-[#00FF41] font-bold">{Math.round(successChance)}%</span>
            </div>
          </div>
          
          {/* Efeitos de Crítico */}
          <div className="pt-3 border-t border-[#00FF41]/30">
            <p className="text-[#999999] text-sm mb-2">Efeitos de Crítico</p>
            <div className="space-y-1">
              {criticalFailure && (
                <p className="text-[#FF0033] text-xs">
                  ⚠ Falha Crítica: Se rolar 1 em qualquer dado, ocorre falha crítica
                </p>
              )}
              {criticalSuccess && (
                <p className="text-[#00FF41] text-xs">
                  ✨ Sucesso Crítico: Se rolar 10 em qualquer dado, ocorre sucesso crítico
                </p>
              )}
              {diceCount === 3 && (
                <p className="text-[#00DDFF] text-xs">
                  💫 Com 3d10, você rola os 3 dados e escolhe os 2 melhores resultados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

