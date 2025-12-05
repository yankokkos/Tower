-- Migration para adicionar novos campos à tabela characters
-- Execute este script se a tabela já existir
-- Nota: Se algum campo já existir, você receberá um erro. Nesse caso, comente a linha correspondente.

-- Adicionar codename
ALTER TABLE characters 
ADD COLUMN codename VARCHAR(255) NULL AFTER name;

-- Adicionar motivation
ALTER TABLE characters 
ADD COLUMN motivation TEXT NULL AFTER appearance;

-- Adicionar xp_history
ALTER TABLE characters 
ADD COLUMN xp_history JSON NULL AFTER level;

-- Adicionar attention
ALTER TABLE characters 
ADD COLUMN attention JSON NULL AFTER xp_history;

