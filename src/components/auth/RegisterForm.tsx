import React, { useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { api } from '../../services/api'
import { authUtils } from '../../utils/auth'
import { Terminal } from 'lucide-react'

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'player' as 'player' | 'master'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMasterPopup, setShowMasterPopup] = useState(false)
  const [confirmations, setConfirmations] = useState({
    anoteiSenha: false,
    entendiSemRecuperacao: false,
    naoVouReclamar: false
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    
    // Verificar se todas as confirmações foram marcadas
    if (!confirmations.anoteiSenha || !confirmations.entendiSemRecuperacao || !confirmations.naoVouReclamar) {
      setError('Você precisa confirmar todas as caixas antes de criar a conta!')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await api.register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      )
      authUtils.saveAuth(response)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0A0A0A] border-2 border-[#00FF41] rounded-lg p-8 shadow-[0_0_30px_rgba(0,255,65,0.5)]">
        <div className="flex items-center justify-center mb-8">
          <Terminal className="w-12 h-12 text-[#00FF41] mr-3" />
          <h1 className="text-[#00FF41]">TOWER RPG</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Nome Completo"
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            type="email"
            label="Email"
            placeholder="agente@tower.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            type="password"
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <Input
            type="password"
            label="Confirmar Senha"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[#00FF41]">Função</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={formData.role === 'player'}
                  onChange={(e) => setFormData({ ...formData, role: 'player' })}
                  className="accent-[#00FF41]"
                />
                <span className="text-white">Jogador</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="master"
                  checked={formData.role === 'master'}
                  onChange={(e) => {
                    // Interceptar tentativa de criar mestre
                    setFormData({ ...formData, role: 'player' })
                    setShowMasterPopup(true)
                    // Fechar popup após 3 segundos
                    setTimeout(() => setShowMasterPopup(false), 3000)
                  }}
                  className="accent-[#00FF41]"
                />
                <span className="text-white">Mestre</span>
              </label>
            </div>
          </div>
          
          {/* Aviso sobre Senha */}
          <div className="bg-[#1A1A1A] border-2 border-[#FF0033] rounded p-4">
            <p className="text-[#FF0033] font-bold text-center mb-3">
              ⚠️ ANOTE A PORRA DA SENHA! EU NÃO CRIEI COISA PARA RECUPERAR! ⚠️
            </p>
            <p className="text-[#CCCCCC] text-sm text-center">
              Sério mesmo. Não tem "esqueci minha senha". Se perder, vai ter que criar conta nova.
            </p>
          </div>
          
          {/* Caixas de Confirmação Engraçadas */}
          <div className="bg-[#0A0A0A] border border-[#00FF41]/50 rounded p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmations.anoteiSenha}
                onChange={(e) => setConfirmations({ ...confirmations, anoteiSenha: e.target.checked })}
                className="mt-1 accent-[#00FF41] w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-white group-hover:text-[#00FF41] transition-colors">
                  ✅ Eu anotei minha senha em um lugar seguro (não no bloco de notas do Windows que fecha sem salvar)
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmations.entendiSemRecuperacao}
                onChange={(e) => setConfirmations({ ...confirmations, entendiSemRecuperacao: e.target.checked })}
                className="mt-1 accent-[#00FF41] w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-white group-hover:text-[#00FF41] transition-colors">
                  ✅ Eu entendi que NÃO EXISTE recuperação de senha e que vou ter que criar conta nova se perder
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmations.naoVouReclamar}
                onChange={(e) => setConfirmations({ ...confirmations, naoVouReclamar: e.target.checked })}
                className="mt-1 accent-[#00FF41] w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-white group-hover:text-[#00FF41] transition-colors">
                  ✅ Eu prometo não reclamar no Discord quando esquecer a senha (porque eu li o aviso acima)
                </p>
              </div>
            </label>
          </div>
          
          {/* Popup de "Tenta Outra" */}
          {showMasterPopup && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-[#0A0A0A] border-4 border-[#FF0033] rounded-lg p-8 shadow-[0_0_50px_rgba(255,0,51,0.8)] max-w-md mx-4">
                <div className="text-center">
                  <h2 className="text-[#FF0033] text-3xl font-bold mb-4">
                    Tenta outra kkkkk 😂
                  </h2>
                  <p className="text-white text-lg mb-6">
                    Você não pode criar conta de Mestre aqui!
                  </p>
                  <p className="text-[#999999] text-sm">
                    (Já foi alterado para Jogador automaticamente)
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-[#1A1A1A] border-2 border-[#FF0033] rounded p-3 text-[#FF0033]">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading || !confirmations.anoteiSenha || !confirmations.entendiSemRecuperacao || !confirmations.naoVouReclamar}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00FF41] hover:text-[#00CC33] transition-colors"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-center text-[#666666] italic">
        "Cada arquivo é uma peça do quebra-cabeça."
      </div>
    </div>
  )
}
