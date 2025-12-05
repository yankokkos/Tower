import { User } from '../types'

const AUTH_STORAGE_KEY = 'tower_auth'

export interface StoredAuth {
  user: User
  token: string
}

export const authUtils = {
  saveAuth(auth: StoredAuth): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  },
  
  getAuth(): StoredAuth | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  },
  
  clearAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },
  
  isAuthenticated(): boolean {
    return this.getAuth() !== null
  },
  
  getCurrentUser(): User | null {
    const auth = this.getAuth()
    return auth ? auth.user : null
  }
}
