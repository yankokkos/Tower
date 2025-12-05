-- Tabelas de Referência para Dados Pré-definidos do Sistema Tower RPG

-- Tabela de Planos de Origem
CREATE TABLE IF NOT EXISTS planes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    category ENUM('elemental', 'interior', 'exterior', 'espelho') NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Templates de Equipamentos (Armas)
CREATE TABLE IF NOT EXISTS equipment_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('weapon', 'armor', 'tool', 'artifact', 'consumable', 'other') NOT NULL DEFAULT 'weapon',
    damage VARCHAR(50) NULL,
    `range` VARCHAR(50) NULL,
    speed ENUM('rapida', 'normal', 'lenta') NULL,
    special JSON NULL,
    category VARCHAR(100) NULL,
    description TEXT NULL,
    properties JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Vantagens
CREATE TABLE IF NOT EXISTS advantages (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost INT NOT NULL,
    category ENUM('combate', 'social', 'mental', 'sobrenatural') NOT NULL,
    mechanical_effect TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_cost (cost)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Desvantagens
CREATE TABLE IF NOT EXISTS disadvantages (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    xp_gain INT NOT NULL,
    category ENUM('fisica', 'psicologica', 'social', 'sobrenatural') NOT NULL,
    penalty TEXT NULL,
    attention_theme VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_xp_gain (xp_gain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

