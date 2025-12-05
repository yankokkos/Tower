import React, { useState, useEffect } from 'react'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { PlayerDashboard } from './components/player/PlayerDashboard'
import { CharacterSheet } from './components/player/CharacterSheet'
import { CharacterForm } from './components/player/CharacterForm'
import { MasterDashboard } from './components/master/MasterDashboard'
import { CampaignView } from './components/master/CampaignView'
import { CampaignForm } from './components/master/CampaignForm'
import { NPCForm } from './components/master/NPCForm'
import { ThreatForm } from './components/master/ThreatForm'
import { ReportForm } from './components/master/ReportForm'
import { SummonForm } from './components/master/SummonForm'
import { DocumentForm } from './components/master/DocumentForm'
import { EventForm } from './components/master/EventForm'
import { Button } from './components/common/Button'
import { authUtils } from './utils/auth'
import { api } from './services/api'
import { ApiError } from './services/api'
import { User, Character, Campaign, NPC, Threat, Report, Summon, Document, CampaignEvent } from './types'
import { LogOut, Terminal } from 'lucide-react'

type View = 
  | 'login'
  | 'register'
  | 'player-dashboard'
  | 'player-character'
  | 'player-character-create'
  | 'player-character-edit'
  | 'master-dashboard'
  | 'master-campaign'
  | 'master-campaign-create'
  | 'master-npc-create'
  | 'master-threat-create'
  | 'master-report-create'
  | 'master-summon-create'
  | 'master-document-create'
  | 'master-event-create'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  
  useEffect(() => {
    // Check if user is already logged in
    const auth = authUtils.getAuth()
    if (auth) {
      setCurrentUser(auth.user)
      if (auth.user.role === 'master') {
        setCurrentView('master-dashboard')
      } else {
        setCurrentView('player-dashboard')
      }
    }
  }, [])
  
  const handleLoginSuccess = () => {
    const auth = authUtils.getAuth()
    if (auth) {
      setCurrentUser(auth.user)
      if (auth.user.role === 'master') {
        setCurrentView('master-dashboard')
      } else {
        setCurrentView('player-dashboard')
      }
    }
  }
  
  const handleLogout = () => {
    authUtils.clearAuth()
    setCurrentUser(null)
    setCurrentView('login')
    setSelectedCharacter(null)
    setSelectedCampaign(null)
  }
  
  const handleViewCharacter = (character: Character) => {
    setSelectedCharacter(character)
    setCurrentView('player-character')
  }
  
  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setCurrentView('master-campaign')
  }
  
  const handleBackToDashboard = () => {
    if (currentUser?.role === 'master') {
      setCurrentView('master-dashboard')
      setSelectedCampaign(null)
    } else {
      setCurrentView('player-dashboard')
      setSelectedCharacter(null)
    }
  }
  
  const handleBackToCampaign = () => {
    setCurrentView('master-campaign')
  }
  
  const handleSaveCharacter = async (characterData: Partial<Character>) => {
    try {
      if (selectedCharacter?.id) {
        // Editando personagem existente
        await api.updateCharacter(selectedCharacter.id, characterData)
        alert('Personagem atualizado com sucesso!')
        const updatedChar = await api.getCharacter(selectedCharacter.id)
        if (updatedChar) {
          setSelectedCharacter(updatedChar)
        }
        setCurrentView('player-character')
      } else {
        // Criando novo personagem
        await api.createCharacter(characterData)
        alert('Personagem criado com sucesso!')
        setCurrentView('player-dashboard')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar personagem')
    }
  }
  
  const handleUpdateCharacter = async (updates: Partial<Character>) => {
    if (!selectedCharacter?.id) return
    
    try {
      await api.updateCharacter(selectedCharacter.id, updates)
      const updatedChar = await api.getCharacter(selectedCharacter.id)
      if (updatedChar) {
        setSelectedCharacter(updatedChar)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar personagem')
    }
  }
  
  const handleSaveCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const campaign = await api.createCampaign(campaignData)
      alert('Campanha criada com sucesso!')
      setSelectedCampaign(campaign)
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar campanha')
    }
  }
  
  const handleSaveNPC = async (npcData: Partial<NPC>) => {
    try {
      await api.createNPC(npcData)
      alert('NPC criado com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar NPC')
    }
  }
  
  const handleSaveThreat = async (threatData: Partial<Threat>) => {
    try {
      await api.createThreat(threatData)
      alert('Ameaça criada com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar ameaça')
    }
  }
  
  const handleSaveReport = async (reportData: Partial<Report>) => {
    try {
      await api.createReport(reportData)
      alert('Relatório criado com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar relatório')
    }
  }
  
  const handleSaveSummon = async (summonData: Partial<Summon>) => {
    try {
      await api.createSummon(summonData)
      alert('Convocação criada com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar convocação')
    }
  }
  
  const handleSaveDocument = async (documentData: Partial<Document>) => {
    try {
      await api.createDocument(documentData)
      alert('Documento criado com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar documento')
    }
  }
  
  const handleSaveEvent = async (eventData: Partial<CampaignEvent>) => {
    try {
      await api.createEvent(eventData)
      alert('Evento criado com sucesso!')
      setCurrentView('master-campaign')
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar evento')
    }
  }
  
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        )
      
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )
      
      case 'player-dashboard':
        return currentUser ? (
          <PlayerDashboard
            user={currentUser}
            onViewCharacter={handleViewCharacter}
            onCreateCharacter={() => setCurrentView('player-character-create')}
          />
        ) : null
      
      case 'player-character':
        return selectedCharacter && currentUser ? (
          <CharacterSheet
            character={selectedCharacter}
            onBack={handleBackToDashboard}
            onEdit={() => setCurrentView('player-character-edit')}
            onUpdate={handleUpdateCharacter}
            canEdit={selectedCharacter.playerId === currentUser.id}
          />
        ) : null
      
      case 'player-character-create':
        return currentUser ? (
          <CharacterForm
            campaignId="campaign-001"
            playerId={currentUser.id}
            onSave={handleSaveCharacter}
            onCancel={handleBackToDashboard}
          />
        ) : null
      
      case 'player-character-edit':
        return selectedCharacter && currentUser ? (
          <CharacterForm
            character={selectedCharacter}
            campaignId={selectedCharacter.campaignId}
            playerId={currentUser.id}
            onSave={handleSaveCharacter}
            onCancel={() => setCurrentView('player-character')}
          />
        ) : null
      
      case 'master-dashboard':
        return currentUser ? (
          <MasterDashboard
            user={currentUser}
            onSelectCampaign={handleSelectCampaign}
            onCreateCampaign={() => setCurrentView('master-campaign-create')}
          />
        ) : null
      
      case 'master-campaign':
        return selectedCampaign && currentUser ? (
          <CampaignView
            campaign={selectedCampaign}
            currentUserId={currentUser.id}
            userRole={currentUser.role}
            onBack={handleBackToDashboard}
            onCreateNPC={() => setCurrentView('master-npc-create')}
            onCreateThreat={() => setCurrentView('master-threat-create')}
            onCreateReport={() => setCurrentView('master-report-create')}
            onCreateSummon={() => setCurrentView('master-summon-create')}
            onCreateDocument={() => setCurrentView('master-document-create')}
            onCreateEvent={() => setCurrentView('master-event-create')}
          />
        ) : null
      
      case 'master-campaign-create':
        return currentUser ? (
          <CampaignForm
            masterId={currentUser.id}
            onSave={handleSaveCampaign}
            onCancel={handleBackToDashboard}
          />
        ) : null
      
      case 'master-npc-create':
        return selectedCampaign && currentUser ? (
          <NPCForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveNPC}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      case 'master-threat-create':
        return selectedCampaign && currentUser ? (
          <ThreatForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveThreat}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      case 'master-report-create':
        return selectedCampaign && currentUser ? (
          <ReportForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveReport}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      case 'master-summon-create':
        return selectedCampaign && currentUser ? (
          <SummonForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveSummon}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      case 'master-document-create':
        return selectedCampaign && currentUser ? (
          <DocumentForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveDocument}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      case 'master-event-create':
        return selectedCampaign && currentUser ? (
          <EventForm
            campaignId={selectedCampaign.id}
            masterId={currentUser.id}
            onSave={handleSaveEvent}
            onCancel={handleBackToCampaign}
          />
        ) : null
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header (only show when logged in) */}
      {currentUser && (
        <header className="border-b-2 border-[#00FF41] bg-[#0A0A0A] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-8 h-8 text-[#00FF41]" />
                <div>
                  <h1 className="text-[#00FF41]">TOWER RPG</h1>
                  <p className="text-[#999999]">
                    {currentUser.role === 'master' ? 'Painel do Mestre' : 'Área do Jogador'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[#00FF41]">{currentUser.name}</p>
                  <p className="text-[#999999]">{currentUser.email}</p>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className={currentUser ? '' : 'flex items-center justify-center min-h-screen p-6'}>
        {renderView()}
      </main>
      
      {/* Footer */}
      {!currentUser && (
        <footer className="fixed bottom-0 w-full text-center p-4 text-[#666666] bg-black/50 backdrop-blur-sm border-t border-[#00FF41]/30">
          <p className="italic">"Cada arquivo é uma peça do quebra-cabeça. Cada terminal é uma porta para o impossível."</p>
        </footer>
      )}
    </div>
  )
}