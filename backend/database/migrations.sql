-- Tower RPG Database Schema
-- MySQL 8.0+
-- NOTA: O banco de dados já existe, apenas criar as tabelas

-- Não criar o banco, apenas usar o existente
-- CREATE DATABASE IF NOT EXISTS u737502399_Tower CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE u737502399_Tower;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('player', 'master') NOT NULL DEFAULT 'player',
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campaigns (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    master_id CHAR(36) NOT NULL,
    status ENUM('active', 'paused', 'completed', 'archived') NOT NULL DEFAULT 'active',
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_master_id (master_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Relação Campanha-Jogador
CREATE TABLE IF NOT EXISTS campaign_players (
    campaign_id CHAR(36) NOT NULL,
    player_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (campaign_id, player_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Personagens
CREATE TABLE IF NOT EXISTS characters (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    player_id CHAR(36) NOT NULL,
    
    -- Informações básicas
    name VARCHAR(255) NOT NULL,
    concept VARCHAR(255) NOT NULL,
    origin TEXT NOT NULL,
    age INT NOT NULL,
    appearance TEXT NULL,
    code VARCHAR(100) NULL,
    rank VARCHAR(100) NULL,
    division VARCHAR(100) NULL,
    recruitment_date DATE NULL,
    status ENUM('active', 'mission', 'injured', 'mia', 'kia') NOT NULL DEFAULT 'active',
    
    -- Atributos (JSON)
    attributes JSON NOT NULL,
    
    -- Status derivados (JSON)
    status_derived JSON NOT NULL,
    
    -- Perícias (JSON)
    skills JSON NOT NULL DEFAULT '[]',
    
    -- Vantagens (JSON)
    advantages JSON NOT NULL DEFAULT '[]',
    
    -- Desvantagens (JSON)
    disadvantages JSON NOT NULL DEFAULT '[]',
    
    -- Rótulos (JSON)
    labels JSON NOT NULL,
    
    -- Plano Interior (JSON)
    inner_plane JSON NOT NULL,
    
    -- Seeds e Poderes (JSON)
    seeds JSON NOT NULL DEFAULT '[]',
    power_themes JSON NOT NULL DEFAULT '[]',
    power_cards JSON NOT NULL DEFAULT '[]',
    
    -- Equipamentos (JSON)
    equipment JSON NOT NULL DEFAULT '[]',
    
    -- Histórico e Relacionamentos
    history TEXT NOT NULL,
    relationships JSON NOT NULL DEFAULT '[]',
    
    -- Metadados
    xp INT NOT NULL DEFAULT 0,
    xp_total INT NOT NULL DEFAULT 0,
    level INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36) NOT NULL,
    last_modified_by CHAR(36) NOT NULL,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (last_modified_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_player_id (player_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de NPCs
CREATE TABLE IF NOT EXISTS npcs (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    affiliation VARCHAR(255) NOT NULL,
    rank VARCHAR(100) NULL,
    age INT NULL,
    appearance TEXT NULL,
    
    -- Atributos e perícias (JSON, opcional)
    attributes JSON NULL,
    skills JSON NULL,
    
    -- Relacionamentos (JSON)
    relationships JSON NOT NULL DEFAULT '[]',
    
    history TEXT NOT NULL,
    notes TEXT NOT NULL,
    
    status ENUM('alive', 'injured', 'mia', 'kia', 'disappeared') NOT NULL DEFAULT 'alive',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ameaças/Monstros
CREATE TABLE IF NOT EXISTS threats (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    type ENUM('creature', 'entity', 'anomaly', 'artifact', 'other') NOT NULL,
    origin_plane VARCHAR(255) NULL,
    
    description TEXT NOT NULL,
    capabilities JSON NOT NULL DEFAULT '[]',
    weaknesses JSON NOT NULL DEFAULT '[]',
    
    -- Estatísticas de combate (JSON)
    combat_stats JSON NOT NULL,
    
    containment_level ENUM('safe', 'eucalipto', 'keter', 'apollyon') NOT NULL,
    danger_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    
    status ENUM('contained', 'supervised', 'to_capture', 'eliminated') NOT NULL,
    location VARCHAR(255) NULL,
    containment_procedures TEXT NULL,
    
    discovery_date DATE NULL,
    incidents JSON NOT NULL DEFAULT '[]',
    
    related_missions JSON NOT NULL DEFAULT '[]',
    related_characters JSON NOT NULL DEFAULT '[]',
    
    notes TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_status (status),
    INDEX idx_containment_level (containment_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS reports (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('mission', 'session', 'general', 'character', 'threat') NOT NULL,
    
    date DATE NOT NULL,
    tags JSON NOT NULL DEFAULT '[]',
    
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    shared_with JSON NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_type (type),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Convocações
CREATE TABLE IF NOT EXISTS summons (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    
    invited_players JSON NOT NULL DEFAULT '[]',
    confirmed_players JSON NOT NULL DEFAULT '[]',
    declined_players JSON NOT NULL DEFAULT '[]',
    
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_date DATETIME NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Documentações
CREATE TABLE IF NOT EXISTS documents (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    shared_with JSON NOT NULL DEFAULT '[]',
    tags JSON NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Eventos de Campanha
CREATE TABLE IF NOT EXISTS campaign_events (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    master_id CHAR(36) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('mission', 'discovery', 'death', 'achievement', 'other') NOT NULL,
    
    date DATE NOT NULL,
    
    related_characters JSON NOT NULL DEFAULT '[]',
    related_threats JSON NOT NULL DEFAULT '[]',
    related_npcs JSON NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_type (type),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

