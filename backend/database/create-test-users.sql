-- Script para criar usuários de teste
-- Execute este script após criar as tabelas principais

-- Usuários de Teste (Players)
-- Senha padrão para todos: "player123"

-- Player 1
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'player1@tower.com', '$2y$12$FIH2RfAylk3U5Ef4.1GR1OXNb/DXojRdEs779d.7RDV4l1Z0C9Qz2', 'Jogador Teste 1', 'player');

-- Player 2
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000002', 'player2@tower.com', '$2y$12$FIH2RfAylk3U5Ef4.1GR1OXNb/DXojRdEs779d.7RDV4l1Z0C9Qz2', 'Jogador Teste 2', 'player');

-- Player 3
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000003', 'player3@tower.com', '$2y$12$FIH2RfAylk3U5Ef4.1GR1OXNb/DXojRdEs779d.7RDV4l1Z0C9Qz2', 'Jogador Teste 3', 'player');

-- Player 4
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000004', 'player4@tower.com', '$2y$12$FIH2RfAylk3U5Ef4.1GR1OXNb/DXojRdEs779d.7RDV4l1Z0C9Qz2', 'Jogador Teste 4', 'player');

-- Player 5
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000005', 'player5@tower.com', '$2y$12$FIH2RfAylk3U5Ef4.1GR1OXNb/DXojRdEs779d.7RDV4l1Z0C9Qz2', 'Jogador Teste 5', 'player');

-- Mestre de Teste (para testes de campanha)
-- Senha: "master123"
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
('00000000-0000-0000-0000-000000000100', 'master@tower.com', '$2y$12$3Zg7dyq7WhtMLHhivPMsz.qY8cl2yi4NfVvQ0ftnNFrjlLrImvGcW', 'Mestre Teste', 'master');

