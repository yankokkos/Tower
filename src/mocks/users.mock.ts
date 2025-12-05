import { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'master@tower.com',
    password: '$2b$10$hashedpassword',
    name: 'Mestre Silva',
    role: 'master',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-01-20')
  },
  {
    id: 'user-002',
    email: 'player1@tower.com',
    password: '$2b$10$hashedpassword',
    name: 'Jogador Um',
    role: 'player',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    lastLoginAt: new Date('2024-01-20')
  },
  {
    id: 'user-003',
    email: 'player2@tower.com',
    password: '$2b$10$hashedpassword',
    name: 'Jogador Dois',
    role: 'player',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    lastLoginAt: new Date('2024-01-19')
  }
]

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email)
  // Para mocks, aceitar qualquer senha
  return user || null
}
