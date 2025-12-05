import React from 'react'
import { Character } from '../../types'
import { CharacterResourceManager } from './CharacterResourceManager'
import { TestCalculator } from './TestCalculator'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { ArrowLeft, Edit } from 'lucide-react'

interface CharacterSheetProps {
  character: Character
  onBack: () => void
  onEdit?: () => void
  onUpdate?: (updates: Partial<Character>) => Promise<void>
  canEdit: boolean
}

export function CharacterSheet({ character, onBack, onEdit, onUpdate, canEdit }: CharacterSheetProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          {canEdit && onEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          )}
        </div>
        
        {/* Character Header */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[#00FF41]">{character.name}</h1>
                  {character.codename && (
                    <span className="text-[#00DDFF] text-lg">"{character.codename}"</span>
                  )}
                </div>
                <p className="text-[#CCCCCC]">{character.concept}</p>
                {character.motivation && (
                  <p className="text-[#999999] text-sm mt-1 italic">"{character.motivation}"</p>
                )}
              </div>
              <span className={`
                px-3 py-1 rounded
                ${character.status === 'active' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                ${character.status === 'mission' ? 'bg-[#00DDFF]/20 text-[#00DDFF]' : ''}
                ${character.status === 'injured' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
              `}>
                {character.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {character.code && (
                <div>
                  <p className="text-[#999999]">Código</p>
                  <p className="text-[#00FF41]">{character.code}</p>
                </div>
              )}
              {character.rank && (
                <div>
                  <p className="text-[#999999]">Patente</p>
                  <p className="text-white">{character.rank}</p>
                </div>
              )}
              {character.division && (
                <div>
                  <p className="text-[#999999]">Divisão</p>
                  <p className="text-white">{character.division}</p>
                </div>
              )}
              <div>
                <p className="text-[#999999]">Idade</p>
                <p className="text-white">{character.age} anos</p>
              </div>
            </div>
            
            {character.appearance && (
              <div>
                <p className="text-[#999999]">Aparência</p>
                <p className="text-white">{character.appearance}</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Status Bars */}
        {onUpdate ? (
          <CharacterResourceManager 
            character={character} 
            onUpdate={onUpdate}
            readOnly={!canEdit}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#00FF41]">PV (Pontos de Vida)</span>
                  <span className="text-[#00FF41]">{character.statusDerived.pv}/{character.statusDerived.pvMax}</span>
                </div>
                <div className="w-full bg-[#1A1A1A] rounded-full h-4 border border-[#00FF41]">
                  <div 
                    className="bg-[#00FF41] h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,255,65,0.8)]"
                    style={{ width: `${(character.statusDerived.pv / character.statusDerived.pvMax) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#00DDFF]">PS (Pontos Simbólicos)</span>
                  <span className="text-[#00DDFF]">{character.statusDerived.ps}/{character.statusDerived.psMax}</span>
                </div>
                <div className="w-full bg-[#1A1A1A] rounded-full h-4 border border-[#00DDFF]">
                  <div 
                    className="bg-[#00DDFF] h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,221,255,0.8)]"
                    style={{ width: `${(character.statusDerived.ps / character.statusDerived.psMax) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#FF00FF]">PE (Pontos de Energia)</span>
                  <span className="text-[#FF00FF]">{character.statusDerived.pe}/{character.statusDerived.peMax}</span>
                </div>
                <div className="w-full bg-[#1A1A1A] rounded-full h-4 border border-[#FF00FF]">
                  <div 
                    className="bg-[#FF00FF] h-full rounded-full transition-all shadow-[0_0_10px_rgba(255,0,255,0.8)]"
                    style={{ width: `${(character.statusDerived.pe / character.statusDerived.peMax) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Attributes */}
        <Card>
          <h2 className="text-[#00FF41] mb-4">Atributos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(character.attributes).map(([key, value]) => (
              <div key={key} className="bg-[#1A1A1A] rounded p-4 text-center border border-[#00FF41]">
                <p className="text-[#999999] capitalize mb-2">{key}</p>
                <p className="text-[#00FF41]">{value}</p>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Skills */}
        {character.skills.length > 0 && (
          <Card>
            <h2 className="text-[#00FF41] mb-4">Perícias</h2>
            <div className="space-y-3">
              {character.skills.map((skill) => (
                <div key={skill.id} className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">{skill.name}</p>
                      <p className="text-[#999999]">Atributo: {skill.attribute}</p>
                    </div>
                    <div className="text-[#00FF41]">
                      Nível {skill.level}
                    </div>
                  </div>
                  {skill.specializations && skill.specializations.length > 0 && (
                    <div className="mt-2 pl-4 space-y-1 border-l-2 border-[#00DDFF]/50">
                      <p className="text-[#00DDFF] text-xs mb-1">Especializações (3d10):</p>
                      {skill.specializations.map((spec) => (
                        <p key={spec.id} className="text-[#CCCCCC] text-sm">
                          → {spec.name} (Nível {spec.level})
                        </p>
                      ))}
                    </div>
                  )}
                  {(!skill.specializations || skill.specializations.length === 0) && skill.level > 0 && (
                    <p className="text-[#00DDFF] text-xs mt-2">Rola 2d10 com perícia</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* XP e Progressão */}
        <Card>
          <h2 className="text-[#00FF41] mb-4">XP e Progressão</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1A1A1A] rounded p-4 border border-[#00FF41]/50 text-center">
              <p className="text-[#999999] text-sm mb-2">XP Disponível</p>
              <p className="text-[#00FF41] text-3xl font-bold">{character.xp || 0}</p>
            </div>
            <div className="bg-[#1A1A1A] rounded p-4 border border-[#00DDFF]/50 text-center">
              <p className="text-[#999999] text-sm mb-2">XP Total</p>
              <p className="text-[#00DDFF] text-3xl font-bold">{character.xpTotal || 0}</p>
            </div>
            <div className="bg-[#1A1A1A] rounded p-4 border border-[#FF00FF]/50 text-center">
              <p className="text-[#999999] text-sm mb-2">Nível</p>
              <p className="text-[#FF00FF] text-3xl font-bold">
                {character.level || Math.floor((character.xpTotal || 0) / 10) + 1}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Vantagens e Desvantagens */}
        {(character.advantages?.length > 0 || character.disadvantages?.length > 0) && (
          <Card>
            <h2 className="text-[#00FF41] mb-4">Vantagens e Desvantagens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.advantages && character.advantages.length > 0 && (
                <div>
                  <h3 className="text-[#00FF41] mb-3">Vantagens</h3>
                  <div className="space-y-2">
                    {character.advantages.map((adv) => (
                      <div key={adv.id} className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                        <p className="text-white font-semibold">{adv.name}</p>
                        <p className="text-[#999999] text-sm mt-1">{adv.mechanicalEffect}</p>
                        <p className="text-[#00DDFF] text-xs mt-1">Custo: {adv.cost} XP</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {character.disadvantages && character.disadvantages.length > 0 && (
                <div>
                  <h3 className="text-[#FF0033] mb-3">Desvantagens</h3>
                  <div className="space-y-2">
                    {character.disadvantages.map((dis) => (
                      <div key={dis.id} className="bg-[#1A1A1A] rounded p-3 border border-[#FF0033]/50">
                        <p className="text-white font-semibold">{dis.name}</p>
                        {dis.penalty && (
                          <p className="text-[#FF0033] text-sm mt-1">{dis.penalty}</p>
                        )}
                        <p className="text-[#00FF41] text-xs mt-1">Ganho: +{dis.xpGain} XP</p>
                        {dis.attentionTheme && (
                          <p className="text-[#00DDFF] text-xs mt-1">Atenção: {dis.attentionTheme}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Seeds e Poderes */}
        {(character.seeds?.length > 0 || character.powerThemes?.length > 0 || character.powerCards?.length > 0) && (
          <Card>
            <h2 className="text-[#00FF41] mb-4">Seeds e Poderes</h2>
            
            {/* Seeds */}
            {character.seeds && character.seeds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#00FF41] mb-3">Seeds</h3>
                <div className="space-y-3">
                  {character.seeds.map((seed) => (
                    <div key={seed.id} className={`bg-[#1A1A1A] rounded p-3 border ${seed.isActive ? 'border-[#00FF41]' : 'border-[#666666]'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-white font-semibold capitalize">{seed.type}</p>
                            <span className={`px-2 py-0.5 rounded text-xs ${seed.isActive ? 'bg-[#00FF41]/20 text-[#00FF41]' : 'bg-[#666666]/20 text-[#666666]'}`}>
                              {seed.isActive ? 'ATIVA' : 'INATIVA'}
                            </span>
                            <span className="text-[#00DDFF] text-sm">Nível {seed.level}</span>
                          </div>
                          <p className="text-[#CCCCCC] text-sm">Plano: {seed.originPlane}</p>
                          <p className="text-[#999999] text-xs mt-1">{seed.description}</p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <p className={seed.controlModifier > 0 ? 'text-[#00FF41]' : seed.controlModifier < 0 ? 'text-[#FF0033]' : 'text-[#999999]'}>
                              Controle: {seed.controlModifier > 0 ? '+' : ''}{seed.controlModifier}
                            </p>
                            <p className={seed.powerModifier > 0 ? 'text-[#00FF41]' : seed.powerModifier < 0 ? 'text-[#FF0033]' : 'text-[#999999]'}>
                              Poder: {seed.powerModifier > 0 ? '+' : ''}{seed.powerModifier}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Temas de Poder */}
            {character.powerThemes && character.powerThemes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#00DDFF] mb-3">Temas de Poder</h3>
                <div className="space-y-2">
                  {character.powerThemes.map((theme) => (
                    <div key={theme.id} className="bg-[#1A1A1A] rounded p-3 border border-[#00DDFF]/50">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{theme.name}</p>
                        {theme.isPrimary && (
                          <span className="bg-[#00FF41]/20 text-[#00FF41] px-2 py-0.5 rounded text-xs">
                            PRIMÁRIO
                          </span>
                        )}
                      </div>
                      <p className="text-[#CCCCCC] text-sm mt-1">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Cartas de Poder */}
            {character.powerCards && character.powerCards.length > 0 && (
              <div>
                <h3 className="text-[#FF00FF] mb-3">Cartas de Poder</h3>
                <div className="space-y-3">
                  {character.powerCards.map((card) => (
                    <div key={card.id} className="bg-[#1A1A1A] rounded p-3 border border-[#FF00FF]/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">{card.name}</p>
                            <span className="text-[#FF00FF] text-sm">Nível {card.level}</span>
                            <span className="text-[#00DDFF] text-sm">Custo: {card.cost} PE</span>
                          </div>
                          <p className="text-[#CCCCCC] text-sm">Tema: {card.theme}</p>
                          <p className="text-[#999999] text-xs mt-1 capitalize">Tempo: {card.time}</p>
                          <p className="text-[#CCCCCC] text-sm mt-2">{card.description}</p>
                          <p className="text-[#00FF41] text-xs mt-1">Efeito: {card.basicEffect}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* Relacionamentos */}
        {character.relationships && character.relationships.length > 0 && (
          <Card>
            <h2 className="text-[#00FF41] mb-4">Relacionamentos</h2>
            <div className="space-y-3">
              {character.relationships.map((rel) => (
                <div key={rel.id} className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">{rel.name}</p>
                        <span className={`
                          px-2 py-0.5 rounded text-xs
                          ${rel.type === 'mentor' ? 'bg-[#00DDFF]/20 text-[#00DDFF]' : ''}
                          ${rel.type === 'ally' ? 'bg-[#00FF41]/20 text-[#00FF41]' : ''}
                          ${rel.type === 'rival' ? 'bg-[#FFD700]/20 text-[#FFD700]' : ''}
                          ${rel.type === 'enemy' ? 'bg-[#FF0033]/20 text-[#FF0033]' : ''}
                          ${rel.type === 'love' ? 'bg-[#FF00FF]/20 text-[#FF00FF]' : ''}
                          ${rel.type === 'other' ? 'bg-[#999999]/20 text-[#999999]' : ''}
                        `}>
                          {rel.type.toUpperCase()}
                        </span>
                      </div>
                      {rel.description && (
                        <p className="text-[#CCCCCC] text-sm mt-1">{rel.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-[#00FF41] mb-2">Rótulo de Poder</h3>
            <p className="text-white">{character.labels.power}</p>
          </Card>
          <Card>
            <h3 className="text-[#FF0033] mb-2">Rótulo de Fraqueza</h3>
            <p className="text-white">{character.labels.weakness}</p>
          </Card>
        </div>
        
        {/* Inner Plane */}
        <Card>
          <h2 className="text-[#00FF41] mb-4">Plano Interior</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-white">{character.innerPlane.name}</p>
              <span className={`
                px-2 py-1 rounded text-xs
                ${character.innerPlane.type === 'fruit' ? 'bg-[#00FF41]/20 text-[#00FF41]' : 'bg-[#FF0033]/20 text-[#FF0033]'}
              `}>
                {character.innerPlane.type === 'fruit' ? 'FRUTO' : 'OBRA'}
              </span>
            </div>
            <p className="text-[#CCCCCC]">{character.innerPlane.description}</p>
          </div>
        </Card>
        
        {/* Equipment */}
        {character.equipment.length > 0 && (
          <Card>
            <h2 className="text-[#00FF41] mb-4">Equipamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {character.equipment.map((item) => (
                <div key={item.id} className={`bg-[#1A1A1A] rounded p-3 border ${item.equipped ? 'border-[#00FF41]' : 'border-[#00FF41]/50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        {item.equipped && (
                          <span className="bg-[#00FF41]/20 text-[#00FF41] px-2 py-0.5 rounded text-xs">
                            EQUIPADO
                          </span>
                        )}
                      </div>
                      <p className="text-[#999999] text-sm capitalize">{item.type}</p>
                      {item.description && (
                        <p className="text-[#CCCCCC] text-sm mt-1">{item.description}</p>
                      )}
                      {item.properties && (
                        <div className="mt-2 space-y-1">
                          {item.properties.damage && (
                            <p className="text-[#FF0033] text-xs">Dano: {item.properties.damage}</p>
                          )}
                          {item.properties.damageReduction && (
                            <p className="text-[#00DDFF] text-xs">Redução: {Math.abs(item.properties.damageReduction)}</p>
                          )}
                          {item.properties.range && (
                            <p className="text-[#FFD700] text-xs">Alcance: {item.properties.range}</p>
                          )}
                          {item.properties.dexterityPenalty && (
                            <p className="text-[#FF0033] text-xs">Penalidade DES: {item.properties.dexterityPenalty}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Calculadora de Testes */}
        <TestCalculator character={character} />
        
        {/* History */}
        <Card>
          <h2 className="text-[#00FF41] mb-4">História</h2>
          <p className="text-white whitespace-pre-wrap">{character.history}</p>
        </Card>
      </div>
    </div>
  )
}