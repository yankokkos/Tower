import React, { useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { api } from '../../services/api'
import { authUtils } from '../../utils/auth'
import { Terminal } from 'lucide-react'

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await api.login(email, password)
      authUtils.saveAuth(response)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
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
            type="email"
            label="Email"
            placeholder="agente@tower.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* Mensagem sobre esquecer senha */}
          <div className="text-center">
            <p className="text-[#FF0033] font-bold text-sm">
              Esqueceu a senha? Se fudeu kkk 😂
            </p>
            <p className="text-[#666666] text-xs mt-1">
              (Não tem recuperação, cria conta nova)
            </p>
          </div>
          
          {error && (
            <div className="bg-[#1A1A1A] border-2 border-[#FF0033] rounded p-3 text-[#FF0033]">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#00FF41] hover:text-[#00CC33] transition-colors"
            >
              Não tem conta? Registre-se
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#00FF41]/30">
            <p className="text-[#999999] text-center">
              Usuários de teste:<br />
              <span className="text-[#00FF41]">master@tower.com</span> (Mestre)<br />
              <span className="text-[#00FF41]">player1@tower.com</span> (Jogador)
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-center text-[#666666] italic">
        "Cada terminal é uma porta para o impossível."
      </div>
    </div>
  )
}
