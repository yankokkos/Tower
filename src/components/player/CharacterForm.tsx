import React, { useState, useEffect } from 'react'
import { Character } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Modal } from '../common/Modal'
import { ArrowLeft, Save, Plus, Trash2, Info } from 'lucide-react'
import { vantagens } from '../../data/vantagens'
import { desvantagens } from '../../data/desvantagens'
import { armas } from '../../data/armas'
import { planos } from '../../data/planos'
import { temasPoder } from '../../data/temasPoder'
import { api } from '../../services/api'

interface CharacterFormProps {
  character?: Character
  campaignId: string
  playerId: string
  onSave: (character: Partial<Character>) => Promise<void>
  onCancel: () => void
}

export function CharacterForm({ character, campaignId, playerId, onSave, onCancel }: CharacterFormProps) {
  const [loading, setLoading] = useState(false)
  const [dbPlanes, setDbPlanes] = useState<any[]>([])
  const [dbWeapons, setDbWeapons] = useState<any[]>([])
  const [dbAdvantages, setDbAdvantages] = useState<any[]>([])
  const [dbDisadvantages, setDbDisadvantages] = useState<any[]>([])
  const [loadingRefData, setLoadingRefData] = useState(true)
  
  const [formData, setFormData] = useState<Partial<Character>>(character || {
    name: '',
    codename: '',
    concept: '',
    origin: '',
    age: 25,
    appearance: '',
    motivation: '',
    code: '',
    rank: '',
    division: '',
    status: 'active',
    attributes: {
      forca: 1,
      destreza: 1,
      constituicao: 1,
      inteligencia: 1,
      sabedoria: 1,
      carisma: 1,
      poder: 1
    },
    skills: [],
    advantages: [],
    disadvantages: [],
    labels: {
      power: '',
      weakness: ''
    },
    innerPlane: {
      name: '',
      type: 'fruit',
      description: ''
    },
    seeds: [],
    powerThemes: [],
    powerCards: [],
    equipment: [],
    history: '',
    relationships: [],
    xp: 0,
    xpTotal: 0,
    xpHistory: [],
    attention: {}
  })
  
  const [newSkill, setNewSkill] = useState({ name: '', attribute: 'forca', level: 1 })
  const [newEquipment, setNewEquipment] = useState({ name: '', type: 'weapon' as const, description: '', damage: '', defense: 0, dexterityPenalty: 0 })
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [newSpecialization, setNewSpecialization] = useState({ name: '', level: 1 })
  const [newRelationship, setNewRelationship] = useState({ type: 'mentor' as const, name: '', description: '' })
  const [showAdvantageModal, setShowAdvantageModal] = useState(false)
  const [showDisadvantageModal, setShowDisadvantageModal] = useState(false)
  const [showWeaponModal, setShowWeaponModal] = useState(false)
  const [newSeed, setNewSeed] = useState({ type: 'cedida' as const, originPlane: '', level: 1 as 1 | 2 | 3, description: '' })
  const [newPowerTheme, setNewPowerTheme] = useState({ themeId: '', isPrimary: false })
  const [newPowerCard, setNewPowerCard] = useState({ name: '', theme: '', cost: 0, time: 'instantaneo' as const, description: '', basicEffect: '', level: 1 as 1 | 2 | 3 })
  
  // Carregar dados de referência do banco
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoadingRefData(true)
        const [planesData, weaponsData, advantagesData, disadvantagesData] = await Promise.all([
          api.getPlanes().catch(() => planos), // Fallback para dados locais
          api.getEquipmentTemplates('weapon').catch(() => armas),
          api.getAdvantages().catch(() => vantagens),
          api.getDisadvantages().catch(() => desvantagens)
        ])
        setDbPlanes(planesData)
        setDbWeapons(weaponsData)
        setDbAdvantages(advantagesData)
        setDbDisadvantages(disadvantagesData)
      } catch (error) {
        console.error('Erro ao carregar dados de referência:', error)
        // Usar dados locais como fallback
        setDbPlanes(planos)
        setDbWeapons(armas)
        setDbAdvantages(vantagens)
        setDbDisadvantages(desvantagens)
      } finally {
        setLoadingRefData(false)
      }
    }
    loadReferenceData()
  }, [])

  // Atualizar formData quando character mudar
  useEffect(() => {
    if (character) {
      setFormData({
        ...character,
        // Garantir que arrays e objetos opcionais existam
        skills: character.skills || [],
        advantages: character.advantages || [],
        disadvantages: character.disadvantages || [],
        seeds: character.seeds || [],
        powerThemes: character.powerThemes || [],
        powerCards: character.powerCards || [],
        equipment: character.equipment || [],
        relationships: character.relationships || [],
        xpHistory: character.xpHistory || [],
        attention: character.attention || {},
        labels: character.labels || { power: '', weakness: '' },
        innerPlane: character.innerPlane || { name: '', type: 'fruit', description: '' }
      })
    }
  }, [character])
  
  // Calcular pontos gastos em atributos
  const calculateAttributePoints = () => {
    const attrs = formData.attributes!
    let total = 0
    Object.values(attrs).forEach(value => {
      if (value <= 3) total += value
      else if (value <= 6) total += 3 + (value - 3) * 2
      else if (value <= 9) total += 3 + 6 + (value - 6) * 3
      else total += 3 + 6 + 9 + 4
    })
    return total
  }
  
  // Calcular status derivados
  const calculateDerivedStats = () => {
    const attrs = formData.attributes!
    const equippedArmor = formData.equipment?.find(e => e.equipped && e.type === 'armor')
    const armorBonus = equippedArmor?.properties?.defense || 0
    
    return {
      pv: attrs.constituicao * 5 + armorBonus,
      pvMax: attrs.constituicao * 5 + armorBonus,
      ps: attrs.sabedoria * 5,
      psMax: attrs.sabedoria * 5,
      pe: attrs.poder * 5,
      peMax: attrs.poder * 5,
      defense: attrs.destreza + 2,
      initiative: attrs.destreza
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.name || !formData.concept || !formData.origin) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    const pointsUsed = calculateAttributePoints()
    if (pointsUsed > 30) {
      alert(`Você usou ${pointsUsed} pontos de atributos. Máximo permitido: 30`)
      return
    }
    
    setLoading(true)
    
    try {
      // Garantir que todos os campos opcionais estejam definidos
      const characterData: Partial<Character> = {
        ...formData,
        campaignId,
        playerId,
        statusDerived: calculateDerivedStats(),
        createdBy: playerId,
        lastModifiedBy: playerId,
        // Garantir arrays vazios se não existirem
        skills: formData.skills || [],
        advantages: formData.advantages || [],
        disadvantages: formData.disadvantages || [],
        seeds: formData.seeds || [],
        powerThemes: formData.powerThemes || [],
        powerCards: formData.powerCards || [],
        equipment: formData.equipment || [],
        relationships: formData.relationships || [],
        xpHistory: formData.xpHistory || [],
        attention: formData.attention || {}
      }
      
      await onSave(characterData)
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar personagem')
    } finally {
      setLoading(false)
    }
  }
  
  const updateAttribute = (attr: string, value: number) => {
    const newValue = Math.max(1, Math.min(10, value))
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes!,
        [attr]: newValue
      }
    })
  }
  
  const addSkill = () => {
    if (!newSkill.name) return
    setFormData({
      ...formData,
      skills: [
        ...(formData.skills || []),
        {
          id: `skill-${Date.now()}`,
          ...newSkill,
          specializations: []
        }
      ]
    })
    setNewSkill({ name: '', attribute: 'forca', level: 1 })
  }
  
  const removeSkill = (id: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(s => s.id !== id)
    })
  }
  
  const addSpecialization = (skillId: string) => {
    if (!newSpecialization.name) return
    
    const skill = formData.skills?.find(s => s.id === skillId)
    if (!skill) return
    
    // Máximo 2 especializações por perícia
    if (skill.specializations && skill.specializations.length >= 2) {
      alert('Máximo de 2 especializações por perícia')
      return
    }
    
    setFormData({
      ...formData,
      skills: formData.skills?.map(s => 
        s.id === skillId 
          ? {
              ...s,
              specializations: [
                ...(s.specializations || []),
                {
                  id: `spec-${Date.now()}`,
                  name: newSpecialization.name,
                  level: newSpecialization.level
                }
              ]
            }
          : s
      )
    })
    
    setNewSpecialization({ name: '', level: 1 })
  }
  
  const removeSpecialization = (skillId: string, specId: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.map(s =>
        s.id === skillId
          ? {
              ...s,
              specializations: s.specializations?.filter(sp => sp.id !== specId)
            }
          : s
      )
    })
  }
  
  const addEquipment = () => {
    if (!newEquipment.name) return
    
    const properties: any = {}
    if (newEquipment.type === 'weapon' && newEquipment.damage) {
      properties.damage = newEquipment.damage
    }
    if (newEquipment.type === 'armor') {
      if (newEquipment.defense) properties.damageReduction = -newEquipment.defense
      if (newEquipment.dexterityPenalty) properties.dexterityPenalty = -newEquipment.dexterityPenalty
    }
    
    setFormData({
      ...formData,
      equipment: [
        ...(formData.equipment || []),
        {
          id: `eq-${Date.now()}`,
          name: newEquipment.name,
          type: newEquipment.type,
          description: newEquipment.description,
          properties: Object.keys(properties).length > 0 ? properties : undefined,
          equipped: false
        }
      ]
    })
    setNewEquipment({ name: '', type: 'weapon', description: '', damage: '', defense: 0, dexterityPenalty: 0 })
  }
  
  const addWeaponFromList = (weaponId: string) => {
    const weapon = dbWeapons.find(a => a.id === weaponId) || armas.find(a => a.id === weaponId)
    if (!weapon) return
    
    const special = Array.isArray(weapon.special) ? weapon.special : (weapon.special ? JSON.parse(weapon.special) : [])
    
    setFormData({
      ...formData,
      equipment: [
        ...(formData.equipment || []),
        {
          id: `eq-${Date.now()}`,
          name: weapon.name,
          type: 'weapon',
          description: `${weapon.category || ''} - ${special.join(', ')}`,
          properties: {
            damage: weapon.damage,
            range: weapon.range || null,
            speed: weapon.speed,
            special: special
          },
          equipped: false
        }
      ]
    })
    setShowWeaponModal(false)
  }
  
  const toggleEquip = (id: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.map(e => {
        if (e.id === id) {
          // Se for armadura, desequipar outras armaduras primeiro
          if (e.type === 'armor' && !e.equipped) {
            return {
              ...e,
              equipped: true
            }
          }
          return { ...e, equipped: !e.equipped }
        }
        // Desequipar outras armaduras se equipando uma nova
        if (e.type === 'armor' && formData.equipment?.find(eq => eq.id === id)?.type === 'armor') {
          return { ...e, equipped: false }
        }
        return e
      })
    })
  }
  
  const removeEquipment = (id: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.filter(e => e.id !== id)
    })
  }
  
  const addRelationship = () => {
    if (!newRelationship.name) return
    
    setFormData({
      ...formData,
      relationships: [
        ...(formData.relationships || []),
        {
          id: `rel-${Date.now()}`,
          ...newRelationship
        }
      ]
    })
    setNewRelationship({ type: 'mentor', name: '', description: '' })
  }
  
  const removeRelationship = (id: string) => {
    setFormData({
      ...formData,
      relationships: formData.relationships?.filter(r => r.id !== id)
    })
  }
  
  const addAdvantage = (advantageId: string) => {
    const advantage = dbAdvantages.find(a => a.id === advantageId) || vantagens.find(a => a.id === advantageId)
    if (!advantage) return
    
    // Verificar se já tem essa vantagem
    if (formData.advantages?.some(a => a.id === advantageId)) {
      alert('Você já possui esta vantagem')
      return
    }
    
    setFormData({
      ...formData,
      advantages: [
        ...(formData.advantages || []),
        {
          id: advantage.id,
          name: advantage.name,
          description: advantage.description,
          cost: advantage.cost || 0,
          mechanicalEffect: advantage.mechanicalEffect || advantage.mechanical_effect || ''
        }
      ]
    })
    setShowAdvantageModal(false)
  }
  
  const removeAdvantage = (id: string) => {
    setFormData({
      ...formData,
      advantages: formData.advantages?.filter(a => a.id !== id)
    })
  }
  
  const addDisadvantage = (disadvantageId: string) => {
    const disadvantage = dbDisadvantages.find(d => d.id === disadvantageId) || desvantagens.find(d => d.id === disadvantageId)
    if (!disadvantage) return
    
    // Verificar se já tem essa desvantagem
    if (formData.disadvantages?.some(d => d.id === disadvantageId)) {
      alert('Você já possui esta desvantagem')
      return
    }
    
    const xpGain = disadvantage.xpGain || disadvantage.xp_gain || 0
    const attentionTheme = disadvantage.attentionTheme || disadvantage.attention_theme
    
    // Atualizar sistema de atenção
    const newAttention = { ...(formData.attention || {}) }
    if (attentionTheme) {
      newAttention[attentionTheme] = (newAttention[attentionTheme] || 0) + 1
    }
    
    setFormData({
      ...formData,
      disadvantages: [
        ...(formData.disadvantages || []),
        {
          id: disadvantage.id,
          name: disadvantage.name,
          description: disadvantage.description,
          xpGain,
          penalty: disadvantage.penalty || null,
          attentionTheme: attentionTheme || null
        }
      ],
      xp: (formData.xp || 0) + xpGain,
      xpTotal: (formData.xpTotal || 0) + xpGain,
      attention: newAttention
    })
    setShowDisadvantageModal(false)
  }
  
  const removeDisadvantage = (id: string) => {
    const disadvantage = formData.disadvantages?.find(d => d.id === id)
    
    // Atualizar sistema de atenção
    const newAttention = { ...(formData.attention || {}) }
    if (disadvantage?.attentionTheme && newAttention[disadvantage.attentionTheme]) {
      newAttention[disadvantage.attentionTheme] = Math.max(0, newAttention[disadvantage.attentionTheme] - 1)
      if (newAttention[disadvantage.attentionTheme] === 0) {
        delete newAttention[disadvantage.attentionTheme]
      }
    }
    
    setFormData({
      ...formData,
      disadvantages: formData.disadvantages?.filter(d => d.id !== id),
      xp: Math.max(0, (formData.xp || 0) - (disadvantage?.xpGain || 0)),
      xpTotal: Math.max(0, (formData.xpTotal || 0) - (disadvantage?.xpGain || 0)),
      attention: newAttention
    })
  }
  
  const addSeed = () => {
    if (!newSeed.originPlane || !newSeed.description) return
    
    // Máximo 1 seed ativa
    const hasActiveSeed = formData.seeds?.some(s => s.isActive)
    if (hasActiveSeed && newSeed.type !== 'despertada') {
      alert('Você já possui uma Seed ativa. Desative a anterior primeiro.')
      return
    }
    
    const controlModifier = newSeed.type === 'cedida' ? 1 : newSeed.type === 'tomada' ? -1 : 0
    const powerModifier = newSeed.type === 'cedida' ? -1 : newSeed.type === 'tomada' ? 1 : 0
    
    setFormData({
      ...formData,
      seeds: [
        ...(formData.seeds || []),
        {
          id: `seed-${Date.now()}`,
          name: `Seed ${newSeed.type}`,
          type: newSeed.type,
          level: newSeed.level,
          originPlane: newSeed.originPlane,
          description: newSeed.description,
          controlModifier,
          powerModifier,
          isActive: true
        }
      ]
    })
    setNewSeed({ type: 'cedida', originPlane: '', level: 1, description: '' })
  }
  
  const removeSeed = (id: string) => {
    setFormData({
      ...formData,
      seeds: formData.seeds?.filter(s => s.id !== id)
    })
  }
  
  const toggleSeedActive = (id: string) => {
    setFormData({
      ...formData,
      seeds: formData.seeds?.map(s => {
        if (s.id === id) {
          return { ...s, isActive: !s.isActive }
        }
        // Se ativando uma seed, desativar outras
        if (s.isActive && formData.seeds?.find(seed => seed.id === id)?.isActive === false) {
          return { ...s, isActive: false }
        }
        return s
      })
    })
  }
  
  const addPowerTheme = () => {
    if (!newPowerTheme.themeId) return
    
    const theme = temasPoder.find(t => t.id === newPowerTheme.themeId)
    if (!theme) return
    
    setFormData({
      ...formData,
      powerThemes: [
        ...(formData.powerThemes || []),
        {
          id: `theme-${Date.now()}`,
          name: theme.name,
          description: theme.description,
          isPrimary: newPowerTheme.isPrimary
        }
      ]
    })
    setNewPowerTheme({ themeId: '', isPrimary: false })
  }
  
  const removePowerTheme = (id: string) => {
    setFormData({
      ...formData,
      powerThemes: formData.powerThemes?.filter(t => t.id !== id)
    })
  }
  
  const addPowerCard = () => {
    if (!newPowerCard.name || !newPowerCard.theme || !newPowerCard.basicEffect) return
    
    setFormData({
      ...formData,
      powerCards: [
        ...(formData.powerCards || []),
        {
          id: `card-${Date.now()}`,
          name: newPowerCard.name,
          theme: newPowerCard.theme,
          cost: newPowerCard.cost,
          time: newPowerCard.time,
          description: newPowerCard.description,
          basicEffect: newPowerCard.basicEffect,
          level: newPowerCard.level
        }
      ]
    })
    setNewPowerCard({ name: '', theme: '', cost: 0, time: 'instantaneo', description: '', basicEffect: '', level: 1 })
  }
  
  const removePowerCard = (id: string) => {
    setFormData({
      ...formData,
      powerCards: formData.powerCards?.filter(c => c.id !== id)
    })
  }
  
  const pointsUsed = calculateAttributePoints()
  const derivedStats = calculateDerivedStats()
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={onCancel} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Cancelar
          </Button>
          <h1 className="text-[#00FF41]">
            {character ? 'Editar Personagem' : 'Novo Personagem'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome *"
                placeholder="Nome do personagem"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                label="Codinome"
                placeholder="Ex: Rastreador, Fantasma, etc"
                value={formData.codename || ''}
                onChange={(e) => setFormData({ ...formData, codename: e.target.value })}
              />
              
              <Input
                label="Conceito *"
                placeholder="Ex: Investigador Implacável"
                value={formData.concept}
                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                required
              />
              
              <Input
                label="Motivação"
                placeholder="O que move seu personagem?"
                value={formData.motivation || ''}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              />
              
              <div className="md:col-span-2">
                <label className="text-[#00FF41] block mb-2">Origem *</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  placeholder="História antes da Tower..."
                  rows={3}
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>
              
              <Input
                type="number"
                label="Idade"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                min={18}
                max={100}
              />
              
              <div className="md:col-span-2">
                <label className="text-[#00FF41] block mb-2">Aparência Física</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  placeholder="Descreva a aparência física do personagem (1-2 frases)"
                  rows={2}
                  value={formData.appearance || ''}
                  onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                />
              </div>
              
              <Input
                label="Código Tower"
                placeholder="Ex: TWR-AG-2024-8472"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              
              <Input
                label="Patente"
                placeholder="Ex: Agente"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
              
              <Input
                label="Divisão"
                placeholder="Ex: DIC"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              />
            </div>
          </Card>
          
          {/* Atributos */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#00FF41]">Atributos</h2>
              <div className={`text-lg ${pointsUsed > 30 ? 'text-[#FF0033]' : 'text-[#00FF41]'}`}>
                Pontos: {pointsUsed}/30
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(formData.attributes!).map(([attr, value]) => (
                <div key={attr} className="bg-[#1A1A1A] rounded p-4 border border-[#00FF41]">
                  <p className="text-[#999999] capitalize text-center mb-3">{attr}</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => updateAttribute(attr, value + 1)}
                      disabled={value >= 10}
                    >
                      +
                    </Button>
                    <div className="text-[#00FF41] text-center text-2xl">{value}</div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => updateAttribute(attr, value - 1)}
                      disabled={value <= 1}
                    >
                      -
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]">
                <p className="text-[#999999]">PV</p>
                <p className="text-[#00FF41]">{derivedStats.pv}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#00DDFF]">
                <p className="text-[#999999]">PS</p>
                <p className="text-[#00DDFF]">{derivedStats.ps}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#FF00FF]">
                <p className="text-[#999999]">PE</p>
                <p className="text-[#FF00FF]">{derivedStats.pe}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]">
                <p className="text-[#999999]">Defesa</p>
                <p className="text-[#00FF41]">{derivedStats.defense}</p>
              </div>
            </div>
          </Card>
          
          {/* Perícias */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Perícias</h2>
            
            {formData.skills && formData.skills.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.skills.map((skill) => (
                  <div key={skill.id} className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{skill.name}</p>
                        <p className="text-[#999999] text-sm">
                          Nível {skill.level} - {skill.attribute}
                          {skill.specializations && skill.specializations.length > 0 && (
                            <span className="text-[#00FF41] ml-2">
                              (3d10 com especialização)
                            </span>
                          )}
                          {(!skill.specializations || skill.specializations.length === 0) && skill.level > 0 && (
                            <span className="text-[#00DDFF] ml-2">
                              (2d10 com perícia)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingSkillId(editingSkillId === skill.id ? null : skill.id)}
                        >
                          {editingSkillId === skill.id ? 'Fechar' : 'Especializações'}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Especializações */}
                    {editingSkillId === skill.id && (
                      <div className="mt-3 pt-3 border-t border-[#00FF41]/30">
                        <p className="text-[#00FF41] text-sm mb-2">Especializações (Máx. 2)</p>
                        
                        {skill.specializations && skill.specializations.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {skill.specializations.map((spec) => (
                              <div key={spec.id} className="flex items-center justify-between bg-[#0A0A0A] rounded p-2 border border-[#00DDFF]/50">
                                <div>
                                  <p className="text-[#CCCCCC] text-sm">{spec.name}</p>
                                  <p className="text-[#999999] text-xs">Nível {spec.level}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeSpecialization(skill.id, spec.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {(!skill.specializations || skill.specializations.length < 2) && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Input
                              placeholder="Nome da especialização"
                              value={newSpecialization.name}
                              onChange={(e) => setNewSpecialization({ ...newSpecialization, name: e.target.value })}
                            />
                            <Input
                              type="number"
                              placeholder="Nível (1-2)"
                              value={newSpecialization.level}
                              onChange={(e) => setNewSpecialization({ ...newSpecialization, level: Math.min(2, Math.max(1, parseInt(e.target.value) || 1)) })}
                              min={1}
                              max={2}
                            />
                            <Button
                              type="button"
                              onClick={() => addSpecialization(skill.id)}
                              size="sm"
                              disabled={!newSpecialization.name}
                            >
                              <Plus className="w-4 h-4" />
                              Adicionar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Nome da perícia"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <select
                className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                value={newSkill.attribute}
                onChange={(e) => setNewSkill({ ...newSkill, attribute: e.target.value })}
              >
                <option value="forca">Força</option>
                <option value="destreza">Destreza</option>
                <option value="constituicao">Constituição</option>
                <option value="inteligencia">Inteligência</option>
                <option value="sabedoria">Sabedoria</option>
                <option value="carisma">Carisma</option>
                <option value="poder">Poder</option>
              </select>
              <Input
                type="number"
                placeholder="Nível"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 1 })}
                min={1}
                max={5}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </Card>
          
          {/* Vantagens e Desvantagens */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Vantagens e Desvantagens</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Vantagens */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#00FF41]">Vantagens</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAdvantageModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
                {formData.advantages && formData.advantages.length > 0 ? (
                  <div className="space-y-2">
                    {formData.advantages.map((adv) => (
                      <div key={adv.id} className="bg-[#1A1A1A] rounded p-2 border border-[#00FF41]/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{adv.name}</p>
                            <p className="text-[#999999] text-xs">{adv.mechanicalEffect}</p>
                            <p className="text-[#00DDFF] text-xs mt-1">Custo: {adv.cost} XP</p>
                          </div>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeAdvantage(adv.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#666666] text-sm">Nenhuma vantagem adicionada</p>
                )}
              </div>
              
              {/* Desvantagens */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#FF0033]">Desvantagens</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDisadvantageModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
                {formData.disadvantages && formData.disadvantages.length > 0 ? (
                  <div className="space-y-2">
                    {formData.disadvantages.map((dis) => (
                      <div key={dis.id} className="bg-[#1A1A1A] rounded p-2 border border-[#FF0033]/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{dis.name}</p>
                            {dis.penalty && (
                              <p className="text-[#FF0033] text-xs">{dis.penalty}</p>
                            )}
                            <p className="text-[#00FF41] text-xs mt-1">Ganho: +{dis.xpGain} XP</p>
                            {dis.attentionTheme && (
                              <p className="text-[#00DDFF] text-xs">Atenção: {dis.attentionTheme}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeDisadvantage(dis.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#666666] text-sm">Nenhuma desvantagem adicionada</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* Rótulos */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Rótulos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Rótulo de Poder *"
                placeholder="Ex: Investigador Implacável"
                value={formData.labels?.power}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  labels: { ...formData.labels!, power: e.target.value }
                })}
                required
              />
              <Input
                label="Rótulo de Fraqueza *"
                placeholder="Ex: Obsessivo até Autodestruição"
                value={formData.labels?.weakness}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  labels: { ...formData.labels!, weakness: e.target.value }
                })}
                required
              />
            </div>
          </Card>
          
          {/* Seeds e Poderes */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Seeds e Poderes</h2>
            
            {/* Seeds */}
            <div className="mb-6">
              <h3 className="text-[#00FF41] mb-3">Seeds</h3>
              {formData.seeds && formData.seeds.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.seeds.map((seed) => (
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
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant={seed.isActive ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => toggleSeedActive(seed.id)}
                          >
                            {seed.isActive ? 'Desativar' : 'Ativar'}
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeSeed(seed.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 bg-[#0A0A0A] p-4 rounded border border-[#00FF41]/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#00FF41] block mb-2">Tipo de Seed *</label>
                    <select
                      className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                      value={newSeed.type}
                      onChange={(e) => setNewSeed({ ...newSeed, type: e.target.value as any })}
                    >
                      <option value="cedida">Cedida (+1 Controle, -1 Poder)</option>
                      <option value="tomada">Tomada (-1 Controle, +1 Poder)</option>
                      <option value="despertada">Despertada (0 Controle, 0 Poder)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#00FF41] block mb-2">Nível *</label>
                    <select
                      className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                      value={newSeed.level}
                      onChange={(e) => setNewSeed({ ...newSeed, level: parseInt(e.target.value) as 1 | 2 | 3 })}
                    >
                      <option value={1}>Nível 1</option>
                      <option value={2}>Nível 2</option>
                      <option value={3}>Nível 3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#00FF41] block mb-2">Plano de Origem *</label>
                  <select
                    className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                    value={newSeed.originPlane}
                    onChange={(e) => setNewSeed({ ...newSeed, originPlane: e.target.value })}
                    disabled={loadingRefData}
                  >
                    <option value="">Selecione um plano...</option>
                    {(dbPlanes.length > 0 ? dbPlanes : planos).map(plano => (
                      <option key={plano.id} value={plano.name}>
                        {plano.name} (Nível {plano.level})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#00FF41] block mb-2">Descrição *</label>
                  <textarea
                    className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                    rows={2}
                    value={newSeed.description}
                    onChange={(e) => setNewSeed({ ...newSeed, description: e.target.value })}
                    placeholder="Descreva a Seed..."
                  />
                </div>
                <Button type="button" onClick={addSeed} size="sm" disabled={!newSeed.originPlane || !newSeed.description}>
                  <Plus className="w-4 h-4" />
                  Adicionar Seed
                </Button>
              </div>
            </div>
            
            {/* Temas de Poder */}
            <div className="mb-6">
              <h3 className="text-[#00FF41] mb-3">Temas de Poder</h3>
              {formData.powerThemes && formData.powerThemes.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.powerThemes.map((theme) => (
                    <div key={theme.id} className="bg-[#1A1A1A] rounded p-2 border border-[#00DDFF]/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
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
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removePowerTheme(theme.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                  value={newPowerTheme.themeId}
                  onChange={(e) => setNewPowerTheme({ ...newPowerTheme, themeId: e.target.value })}
                >
                  <option value="">Selecione um tema...</option>
                  {temasPoder.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPowerTheme.isPrimary}
                    onChange={(e) => setNewPowerTheme({ ...newPowerTheme, isPrimary: e.target.checked })}
                    className="accent-[#00FF41]"
                  />
                  <span className="text-white text-sm">Tema Primário</span>
                </label>
                <Button type="button" onClick={addPowerTheme} size="sm" disabled={!newPowerTheme.themeId}>
                  <Plus className="w-4 h-4" />
                  Adicionar Tema
                </Button>
              </div>
            </div>
            
            {/* Cartas de Poder */}
            <div>
              <h3 className="text-[#00FF41] mb-3">Cartas de Poder</h3>
              {formData.powerCards && formData.powerCards.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.powerCards.map((card) => (
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
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removePowerCard(card.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 bg-[#0A0A0A] p-4 rounded border border-[#FF00FF]/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Nome da Carta *"
                    value={newPowerCard.name}
                    onChange={(e) => setNewPowerCard({ ...newPowerCard, name: e.target.value })}
                  />
                  <select
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                    value={newPowerCard.theme}
                    onChange={(e) => setNewPowerCard({ ...newPowerCard, theme: e.target.value })}
                  >
                    <option value="">Selecione o tema...</option>
                    {formData.powerThemes?.map(theme => (
                      <option key={theme.id} value={theme.name}>{theme.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    type="number"
                    placeholder="Custo PE *"
                    value={newPowerCard.cost || ''}
                    onChange={(e) => setNewPowerCard({ ...newPowerCard, cost: parseInt(e.target.value) || 0 })}
                  />
                  <select
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                    value={newPowerCard.time}
                    onChange={(e) => setNewPowerCard({ ...newPowerCard, time: e.target.value as any })}
                  >
                    <option value="instantaneo">Instantâneo</option>
                    <option value="turno">Turno</option>
                    <option value="continuo">Contínuo</option>
                    <option value="reacao">Reação</option>
                    <option value="ritual">Ritual</option>
                  </select>
                  <select
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                    value={newPowerCard.level}
                    onChange={(e) => setNewPowerCard({ ...newPowerCard, level: parseInt(e.target.value) as 1 | 2 | 3 })}
                  >
                    <option value={1}>Nível 1</option>
                    <option value={2}>Nível 2</option>
                    <option value={3}>Nível 3</option>
                  </select>
                </div>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                  rows={2}
                  placeholder="Descrição da carta..."
                  value={newPowerCard.description}
                  onChange={(e) => setNewPowerCard({ ...newPowerCard, description: e.target.value })}
                />
                <Input
                  placeholder="Efeito Básico *"
                  value={newPowerCard.basicEffect}
                  onChange={(e) => setNewPowerCard({ ...newPowerCard, basicEffect: e.target.value })}
                />
                <Button type="button" onClick={addPowerCard} size="sm" disabled={!newPowerCard.name || !newPowerCard.theme || !newPowerCard.basicEffect}>
                  <Plus className="w-4 h-4" />
                  Adicionar Carta
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Plano Interior */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Plano Interior</h2>
            <div className="space-y-4">
              <Input
                label="Nome do Plano *"
                placeholder="Ex: Paz Interior"
                value={formData.innerPlane?.name}
                onChange={(e) => setFormData({
                  ...formData,
                  innerPlane: { ...formData.innerPlane!, name: e.target.value }
                })}
                required
              />
              
              <div>
                <label className="text-[#00FF41] block mb-2">Tipo *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planeType"
                      value="fruit"
                      checked={formData.innerPlane?.type === 'fruit'}
                      onChange={() => setFormData({
                        ...formData,
                        innerPlane: { ...formData.innerPlane!, type: 'fruit' }
                      })}
                      className="accent-[#00FF41]"
                    />
                    <span className="text-white">Fruto (Bom)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planeType"
                      value="work"
                      checked={formData.innerPlane?.type === 'work'}
                      onChange={() => setFormData({
                        ...formData,
                        innerPlane: { ...formData.innerPlane!, type: 'work' }
                      })}
                      className="accent-[#FF0033]"
                    />
                    <span className="text-white">Obra (Escuro)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-[#00FF41] block mb-2">Descrição *</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  placeholder="Como esse plano influencia o personagem..."
                  rows={3}
                  value={formData.innerPlane?.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    innerPlane: { ...formData.innerPlane!, description: e.target.value }
                  })}
                  required
                />
              </div>
            </div>
          </Card>
          
          {/* Equipamento */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#00FF41]">Equipamento</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowWeaponModal(true)}
              >
                <Plus className="w-4 h-4" />
                Armas Pré-definidas
              </Button>
            </div>
            
            {formData.equipment && formData.equipment.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {formData.equipment.map((item) => (
                  <div key={item.id} className={`bg-[#1A1A1A] rounded p-3 border ${item.equipped ? 'border-[#00FF41]' : 'border-[#00FF41]/50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant={item.equipped ? "secondary" : "primary"}
                          size="sm"
                          onClick={() => toggleEquip(item.id)}
                        >
                          {item.equipped ? 'Desequipar' : 'Equipar'}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeEquipment(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Nome do item"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                />
                <select
                  className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value as any, damage: '', defense: 0, dexterityPenalty: 0 })}
                >
                  <option value="weapon">Arma</option>
                  <option value="armor">Armadura</option>
                  <option value="tool">Ferramenta</option>
                  <option value="artifact">Artefato</option>
                  <option value="consumable">Consumível</option>
                  <option value="other">Outro</option>
                </select>
                <Input
                  placeholder="Descrição"
                  value={newEquipment.description}
                  onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                />
              </div>
              
              {newEquipment.type === 'weapon' && (
                <Input
                  placeholder="Dano (ex: 1d10+2)"
                  value={newEquipment.damage}
                  onChange={(e) => setNewEquipment({ ...newEquipment, damage: e.target.value })}
                />
              )}
              
              {newEquipment.type === 'armor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Redução de dano (ex: 3)"
                    value={newEquipment.defense || ''}
                    onChange={(e) => setNewEquipment({ ...newEquipment, defense: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="Penalidade em Destreza (ex: 1)"
                    value={newEquipment.dexterityPenalty || ''}
                    onChange={(e) => setNewEquipment({ ...newEquipment, dexterityPenalty: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}
              
              <Button type="button" onClick={addEquipment} size="sm" disabled={!newEquipment.name}>
                <Plus className="w-4 h-4" />
                Adicionar Equipamento
              </Button>
            </div>
          </Card>
          
          {/* Relacionamentos */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">Relacionamentos</h2>
            
            {formData.relationships && formData.relationships.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.relationships.map((rel) => (
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
                          <p className="text-[#CCCCCC] text-sm">{rel.description}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeRelationship(rel.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded"
                  value={newRelationship.type}
                  onChange={(e) => setNewRelationship({ ...newRelationship, type: e.target.value as any })}
                >
                  <option value="mentor">Mentor</option>
                  <option value="ally">Aliado</option>
                  <option value="rival">Rival</option>
                  <option value="enemy">Inimigo</option>
                  <option value="love">Amor</option>
                  <option value="other">Outro</option>
                </select>
                <Input
                  placeholder="Nome do relacionamento"
                  value={newRelationship.name}
                  onChange={(e) => setNewRelationship({ ...newRelationship, name: e.target.value })}
                />
                <Button
                  type="button"
                  onClick={addRelationship}
                  size="sm"
                  disabled={!newRelationship.name}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
              <Input
                placeholder="Descrição do relacionamento (opcional)"
                value={newRelationship.description}
                onChange={(e) => setNewRelationship({ ...newRelationship, description: e.target.value })}
              />
            </div>
          </Card>
          
          {/* XP e Progressão */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">XP e Progressão</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50">
                <p className="text-[#999999] text-sm">XP Disponível</p>
                <p className="text-[#00FF41] text-2xl font-bold">{formData.xp || 0}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#00DDFF]/50">
                <p className="text-[#999999] text-sm">XP Total</p>
                <p className="text-[#00DDFF] text-2xl font-bold">{formData.xpTotal || 0}</p>
              </div>
              <div className="bg-[#1A1A1A] rounded p-3 border border-[#FF00FF]/50">
                <p className="text-[#999999] text-sm">Nível</p>
                <p className="text-[#FF00FF] text-2xl font-bold">
                  {formData.level || Math.floor((formData.xpTotal || 0) / 10) + 1}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#00FF41] block mb-2">Adicionar XP</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Quantidade de XP"
                    value=""
                    onChange={(e) => {
                      const amount = parseInt(e.target.value) || 0
                      if (amount > 0) {
                        setFormData({
                          ...formData,
                          xp: (formData.xp || 0) + amount,
                          xpTotal: (formData.xpTotal || 0) + amount,
                          xpHistory: [
                            ...(formData.xpHistory || []),
                            {
                              date: new Date(),
                              amount,
                              source: 'manual',
                              description: `Adicionado ${amount} XP manualmente`
                            }
                          ]
                        })
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[#00FF41] block mb-2">Gastar XP</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Quantidade de XP"
                    value=""
                    onChange={(e) => {
                      const amount = parseInt(e.target.value) || 0
                      if (amount > 0 && amount <= (formData.xp || 0)) {
                        setFormData({
                          ...formData,
                          xp: (formData.xp || 0) - amount,
                          xpHistory: [
                            ...(formData.xpHistory || []),
                            {
                              date: new Date(),
                              amount: -amount,
                              source: 'gasto',
                              description: `Gasto ${amount} XP`
                            }
                          ]
                        })
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {formData.xpHistory && formData.xpHistory.length > 0 && (
              <div className="mt-4">
                <p className="text-[#00FF41] text-sm mb-2">Histórico de XP</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {formData.xpHistory.slice(-10).reverse().map((entry, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] rounded p-2 border border-[#00FF41]/30">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${entry.amount > 0 ? 'text-[#00FF41]' : 'text-[#FF0033]'}`}>
                          {entry.amount > 0 ? '+' : ''}{entry.amount} XP
                        </p>
                        <p className="text-[#999999] text-xs">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-[#CCCCCC] text-xs mt-1">{entry.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* História */}
          <Card>
            <h2 className="text-[#00FF41] mb-4">História</h2>
            <textarea
              className="w-full px-4 py-2 bg-[#1A1A1A] border-2 border-[#00FF41] text-white rounded placeholder:text-[#666666] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]"
              placeholder="História completa do personagem..."
              rows={6}
              value={formData.history}
              onChange={(e) => setFormData({ ...formData, history: e.target.value })}
            />
          </Card>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || pointsUsed > 30}>
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Personagem'}
            </Button>
          </div>
        </form>
        
        {/* Modal de Vantagens */}
        {showAdvantageModal && (
          <Modal
            isOpen={showAdvantageModal}
            onClose={() => setShowAdvantageModal(false)}
            title="Selecionar Vantagem"
          >
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(dbAdvantages.length > 0 ? dbAdvantages : vantagens).map((adv) => {
                const alreadyHas = formData.advantages?.some(a => a.id === adv.id)
                return (
                  <div
                    key={adv.id}
                    className={`p-3 rounded border ${
                      alreadyHas
                        ? 'bg-[#1A1A1A] border-[#666666] opacity-50'
                        : 'bg-[#1A1A1A] border-[#00FF41]/50 hover:border-[#00FF41] cursor-pointer'
                    }`}
                    onClick={() => !alreadyHas && addAdvantage(adv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{adv.name}</p>
                        <p className="text-[#CCCCCC] text-sm mt-1">{adv.description}</p>
                        <p className="text-[#999999] text-xs mt-1">{adv.mechanicalEffect || adv.mechanical_effect || ''}</p>
                        <p className="text-[#00DDFF] text-xs mt-1">Custo: {adv.cost || 0} XP</p>
                      </div>
                      {alreadyHas && (
                        <span className="text-[#666666] text-xs">Já possui</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Modal>
        )}
        
        {/* Modal de Desvantagens */}
        {showDisadvantageModal && (
          <Modal
            isOpen={showDisadvantageModal}
            onClose={() => setShowDisadvantageModal(false)}
            title="Selecionar Desvantagem"
          >
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(dbDisadvantages.length > 0 ? dbDisadvantages : desvantagens).map((dis) => {
                const alreadyHas = formData.disadvantages?.some(d => d.id === dis.id)
                return (
                  <div
                    key={dis.id}
                    className={`p-3 rounded border ${
                      alreadyHas
                        ? 'bg-[#1A1A1A] border-[#666666] opacity-50'
                        : 'bg-[#1A1A1A] border-[#FF0033]/50 hover:border-[#FF0033] cursor-pointer'
                    }`}
                    onClick={() => !alreadyHas && addDisadvantage(dis.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{dis.name}</p>
                        <p className="text-[#CCCCCC] text-sm mt-1">{dis.description}</p>
                        {dis.penalty && (
                          <p className="text-[#FF0033] text-xs mt-1">Penalidade: {dis.penalty}</p>
                        )}
                        <p className="text-[#00FF41] text-xs mt-1">Ganho: +{dis.xpGain || dis.xp_gain || 0} XP</p>
                        {(dis.attentionTheme || dis.attention_theme) && (
                          <p className="text-[#00DDFF] text-xs mt-1">Atenção: {dis.attentionTheme || dis.attention_theme}</p>
                        )}
                      </div>
                      {alreadyHas && (
                        <span className="text-[#666666] text-xs">Já possui</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Modal>
        )}
        
        {/* Modal de Armas */}
        {showWeaponModal && (
          <Modal
            isOpen={showWeaponModal}
            onClose={() => setShowWeaponModal(false)}
            title="Selecionar Arma do Arsenal"
          >
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(dbWeapons.length > 0 ? dbWeapons : armas).map((weapon) => (
                <div
                  key={weapon.id}
                  className="bg-[#1A1A1A] rounded p-3 border border-[#00FF41]/50 hover:border-[#00FF41] cursor-pointer"
                  onClick={() => addWeaponFromList(weapon.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{weapon.name}</p>
                      <p className="text-[#FF0033] text-sm mt-1">Dano: {weapon.damage}</p>
                      {weapon.range && (
                        <p className="text-[#FFD700] text-xs mt-1">Alcance: {weapon.range}</p>
                      )}
                      <p className="text-[#999999] text-xs mt-1 capitalize">
                        Velocidade: {weapon.speed} | {weapon.special.join(', ')}
                      </p>
                      <p className="text-[#00DDFF] text-xs mt-1 capitalize">{weapon.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
