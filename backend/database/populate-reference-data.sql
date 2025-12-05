-- Script para popular tabelas de referência com dados do sistema Tower RPG

-- Limpar dados existentes (opcional - descomente se quiser resetar)
-- TRUNCATE TABLE planes;
-- TRUNCATE TABLE equipment_templates;
-- TRUNCATE TABLE advantages;
-- TRUNCATE TABLE disadvantages;

-- ============================================
-- PLANOS DE ORIGEM
-- ============================================

-- Planos Elementais (Nível -2)
INSERT INTO planes (id, name, level, category, description) VALUES
('agua', 'Plano da Água', -2, 'elemental', 'Emoção fluida, ressonância viva'),
('terra', 'Plano da Terra', -2, 'elemental', 'Estabilidade absoluta, gravidade simbólica'),
('ar', 'Plano do Ar', -2, 'elemental', 'Movimento leve, invisível, impreciso'),
('fogo', 'Plano do Fogo', -2, 'elemental', 'Chamas, queimadura, paixão'),
('eter', 'Plano do Éter', -2, 'elemental', 'Luz lunar, ciclos, presciência');

-- Planos Elementais (Nível -1)
INSERT INTO planes (id, name, level, category, description) VALUES
('plantas', 'Plano das Plantas', -1, 'elemental', 'Vegetação, crescimento'),
('animais', 'Plano dos Animais', -1, 'elemental', 'Formas animais, instinto');

-- Planos Espelhos (Nível 1)
INSERT INTO planes (id, name, level, category, description) VALUES
('medo', 'Plano do Medo', 1, 'espelho', 'Fobias, terror, trevas'),
('desejo', 'Plano do Desejo', 1, 'espelho', 'Tentações, desejos, manifestação de fantasias');

-- Planos Interiores - Frutos (Nível 2)
INSERT INTO planes (id, name, level, category, description) VALUES
('amor', 'Plano do Amor', 2, 'interior', 'Afeto, compaixão, conexão'),
('alegria', 'Plano da Alegria', 2, 'interior', 'Felicidade, energia positiva'),
('paz', 'Plano da Paz', 2, 'interior', 'Harmonia, calma, estabilidade emocional'),
('paciencia', 'Plano da Paciência', 2, 'interior', 'Calma, espera, controle'),
('amabilidade', 'Plano da Amabilidade', 2, 'interior', 'Gentileza, bondade, compaixão'),
('bondade', 'Plano da Bondade', 2, 'interior', 'Benevolência, altruísmo'),
('fidelidade', 'Plano da Fidelidade', 2, 'interior', 'Lealdade, compromisso'),
('mansidao', 'Plano da Mansidão', 2, 'interior', 'Humildade, suavidade'),
('dominio-proprio', 'Plano do Domínio Próprio', 2, 'interior', 'Autocontrole, disciplina');

-- Planos Interiores - Obras (Nível 2)
INSERT INTO planes (id, name, level, category, description) VALUES
('odio', 'Plano do Ódio', 2, 'interior', 'Rancor, isolamento, desconfiança'),
('tristeza', 'Plano da Tristeza', 2, 'interior', 'Melancolia, desesperança'),
('discordia', 'Plano da Discórdia', 2, 'interior', 'Conflito, desarmonia'),
('ira', 'Plano da Ira', 2, 'interior', 'Fúria, reatividade, paixão destrutiva'),
('crueldade', 'Plano da Crueldade', 2, 'interior', 'Malícia, indiferença ao sofrimento'),
('maldade', 'Plano da Maldade', 2, 'interior', 'Malevolência, egoísmo extremo'),
('traicao', 'Plano da Traição', 2, 'interior', 'Deslealdade, engano'),
('orgulho', 'Plano do Orgulho', 2, 'interior', 'Arrogância, vaidade'),
('libertinagem', 'Plano da Libertinagem', 2, 'interior', 'Falta de controle, excesso');

-- Planos Exteriores (Nível 3)
INSERT INTO planes (id, name, level, category, description) VALUES
('caos', 'Plano do Caos', 3, 'exterior', 'Desordem aleatória, imprevisibilidade'),
('ordem', 'Plano da Ordem', 3, 'exterior', 'Estrutura perfeita, padrões rígidos'),
('inconsciente', 'Espiral do Inconsciente', 3, 'exterior', 'Sonhos, memórias, arquétipos primordiais');

-- ============================================
-- EQUIPAMENTOS (ARMAS)
-- ============================================

-- Armas Corpo a Corpo - Uma Mão
INSERT INTO equipment_templates (id, name, type, damage, speed, special, category) VALUES
('punho', 'Punho', 'weapon', '1d4', 'rapida', '["sempre-disponivel"]', 'corpo-a-corpo'),
('adaga', 'Adaga', 'weapon', '1d6', 'rapida', '["discreta", "rapida"]', 'corpo-a-corpo'),
('espada-curta', 'Espada Curta', 'weapon', '1d8', 'normal', '["balanceada", "versatil"]', 'corpo-a-corpo'),
('machado', 'Machado', 'weapon', '1d10', 'normal', '["pesado"]', 'corpo-a-corpo'),
('taco', 'Taco', 'weapon', '1d8', 'normal', '["contundente", "simples"]', 'corpo-a-corpo'),
('corrente', 'Corrente', 'weapon', '1d8', 'normal', '["alcance", "flexivel"]', 'corpo-a-corpo');

-- Armas Corpo a Corpo - Duas Mãos
INSERT INTO equipment_templates (id, name, type, damage, speed, special, category, `range`) VALUES
('espada-longa', 'Espada Longa', 'weapon', '1d10', 'normal', '["classica", "versatil"]', 'corpo-a-corpo', NULL),
('machado-grande', 'Machado Grande', 'weapon', '1d12', 'lenta', '["muito-pesado", "muito-dano"]', 'corpo-a-corpo', NULL),
('lanca', 'Lança', 'weapon', '1d10', 'normal', '["alcance-medio", "otimo-em-grupo"]', 'corpo-a-corpo', '3m'),
('cajado', 'Cajado', 'weapon', '1d8', 'normal', '["magico", "suporta-cartas"]', 'arcana', NULL);

-- Armas à Distância
INSERT INTO equipment_templates (id, name, type, damage, `range`, speed, special, category) VALUES
('arco', 'Arco', 'weapon', '1d8', '50m', 'lenta', '["silencioso", "municao-limitada"]', 'distancia'),
('besta', 'Besta', 'weapon', '1d10', '60m', 'lenta', '["mais-dano", "recarga-lenta"]', 'distancia'),
('pistola', 'Pistola', 'weapon', '1d10', '20m', 'normal', '["moderno", "municao-limitada"]', 'distancia'),
('rifle', 'Rifle', 'weapon', '2d8', '100m', 'lenta', '["muito-alcance", "municao-limitada"]', 'distancia'),
('lancador', 'Lançador', 'weapon', '1d12', '50m', 'lenta', '["area", "municao-muito-limitada"]', 'distancia');

-- Armas Arcanas
INSERT INTO equipment_templates (id, name, type, damage, speed, special, category) VALUES
('bastao-magico', 'Bastão Mágico', 'weapon', '1d8 + POD', 'normal', '["canaliza-magia", "reduz-dificuldade-magia"]', 'arcana'),
('varita', 'Varita', 'weapon', '1d6 + POD', 'rapida', '["pequena", "versatil", "bonus-pe"]', 'arcana'),
('espada-runica', 'Espada Rúnica', 'weapon', '1d10 + POD', 'normal', '["arma-magia", "bonus-critico"]', 'arcana'),
('adaga-de-alma', 'Adaga de Alma', 'weapon', '1d6 + POD', 'rapida', '["afeta-planos", "ignora-armadura"]', 'arcana');

-- ============================================
-- VANTAGENS
-- ============================================

-- Vantagens de Combate
INSERT INTO advantages (id, name, description, cost, category, mechanical_effect) VALUES
('reflexos-aguçados', 'Reflexos Aguçados', 'Você sempre reage primeiro em situações de perigo', 3, 'combate', '+2 em iniciativa'),
('luta-aprimorada', 'Luta Aprimorada', 'Treinamento em artes marciais avançadas', 2, 'combate', '+1 em combate corpo a corpo'),
('tiro-certeiro', 'Tiro Certeiro', 'Precisão sobre-humana com armas à distância', 3, 'combate', '+2 em tiros críticos'),
('mestre', 'Mestre', 'Maestria absoluta em uma perícia específica. Requer Perícia 5 e Especialização 2', 15, 'combate', 'Crítico ocorre com 9 OU 10 (ao invés de apenas 10)');

-- Vantagens Sociais
INSERT INTO advantages (id, name, description, cost, category, mechanical_effect) VALUES
('presenca-carismatica', 'Presença Carismática', 'Pessoas gostam naturalmente de você', 2, 'social', '+2 em Persuasão'),
('mentor-influente', 'Mentor Influente', 'Conhece pessoas importantes e tem acesso a recursos', 3, 'social', '+1 em contatos, acesso a recursos');

-- Vantagens Mentais
INSERT INTO advantages (id, name, description, cost, category, mechanical_effect) VALUES
('mente-forte', 'Mente Forte', 'Vontade de ferro, resistência a controle mental', 3, 'mental', '+5 PS, resistência a controle mental'),
('inteligencia-brilhante', 'Inteligência Brilhante', 'Capacidade mental excepcional', 2, 'mental', '+2 em testes de INT'),
('vontade-inquebravel', 'Vontade Inquebrável', 'Sobrevivente de colapso simbólico', 3, 'mental', 'Rola 2 dados em testes de PS, escolhe o melhor');

-- Vantagens Sobrenaturais
INSERT INTO advantages (id, name, description, cost, category, mechanical_effect) VALUES
('resistencia-planar', 'Resistência Planar', 'Seu corpo rejeita energia planar', 3, 'sobrenatural', '+2 em resistência contra magia'),
('conexao-espiritual', 'Conexão Espiritual', 'Naturalmente conectado aos planos', 2, 'sobrenatural', '+1 em PE inicial, sente presença espiritual'),
('visao-onirica', 'Visão Onírica', 'Pode ver em sonhos locais e entidades reais', 3, 'sobrenatural', 'Fragmento de Arcadia - visão em sonhos'),
('portador-de-runas', 'Portador de Runas', 'Pode ativar artefatos mesmo sem treinamento', 2, 'sobrenatural', 'Implante ou marca deixada por Seed'),
('sussurros-do-vento', 'Sussurros do Vento', 'Ouve frases proféticas em locais altos', 2, 'sobrenatural', '+1 em testes de previsão'),
('conexao-ancestral', 'Conexão Ancestral', 'Sangue planar herdado', 2, 'sobrenatural', '+1 em testes de Sabedoria em locais esquecidos'),
('armadura-oculta', 'Armadura Oculta', 'Treinamento com DIC ou DOE', 2, 'sobrenatural', '+1 de defesa contra ataque mágico invisível');

-- ============================================
-- DESVANTAGENS
-- ============================================

-- Desvantagens Físicas
INSERT INTO disadvantages (id, name, description, xp_gain, category, penalty) VALUES
('fraco-fragil', 'Fraco/Frágil', 'Corpo fraco ou enfermo', 3, 'fisica', '-1 em Força ou Constituição'),
('lento', 'Lento', 'Sempre por último em ações', 2, 'fisica', '-2 em iniciativa'),
('bronze-em-forma-de-gente', 'Bronze em Forma de Gente', 'Corpo rígido, pouco flexível', 2, 'fisica', 'Suscetível a calor e eletricidade');

-- Desvantagens Psicológicas
INSERT INTO disadvantages (id, name, description, xp_gain, category, penalty, attention_theme) VALUES
('fobia', 'Fobia', 'Medo intenso e paralisante de algo específico', 2, 'psicologica', '-2 em testes se confronta medo', 'Subversão'),
('culpa-existencial', 'Culpa Existencial', 'Remorso profundo por ações passadas', 3, 'psicologica', '-1 em Carisma, risco de paralisia moral', 'Expressividade'),
('medo-de-espelhos', 'Medo de Espelhos', 'Após ver uma versão corrompida de si mesmo', 2, 'psicologica', 'Penalidade em locais com reflexos', 'Subversão'),
('carrega-o-luto', 'Carrega o Luto', 'A dor de uma perda nunca se apagou', 2, 'psicologica', 'Ao ver alguém ferido ou falhar em proteger', 'Fortaleza'),
('instabilidade-sonora', 'Instabilidade Sonora', 'Sons aleatórios ativam flashes de memória planar', 2, 'psicologica', '-1 em testes de concentração em combate', 'Previsão'),
('sussurros-do-submundo', 'Sussurros do Submundo', 'Vozes o distraem em momentos de tensão', 2, 'psicologica', 'Ao tentar manter foco ou concentração', 'Subversão');

-- Desvantagens Sociais
INSERT INTO disadvantages (id, name, description, xp_gain, category, penalty, attention_theme) VALUES
('infame', 'Infame', 'Sua reputação precede você (negativamente)', 2, 'social', '-2 em testes sociais com certos grupos', 'Expressividade'),
('divida', 'Dívida', 'Deve favores a alguém poderoso', 2, 'social', 'Está em dívida com entidade perigosa', 'Relíquia'),
('aura-de-perda', 'Aura de Perda', 'Drena moral de aliados se falhar em ação emocional', 2, 'social', 'Memória ativa de alguém morto no plano', 'Expressividade'),
('obcecado-por-justica', 'Obcecado por Justiça', 'Sempre age antes de tentar entender', 2, 'social', 'Falha crítica em missão diplomática', 'Fortaleza'),
('obcecada-por-outras-feiticeiras', 'Obcecada por Outras Feiticeiras', 'Se distrai com qualquer presença semelhante', 2, 'social', 'Ao enfrentar ou encontrar mágicas rivais', 'Subversão');

-- Desvantagens Sobrenaturais
INSERT INTO disadvantages (id, name, description, xp_gain, category, penalty, attention_theme) VALUES
('maldicao-planar', 'Maldição Planar', 'Alguma coisa no universo não quer você aqui', 3, 'sobrenatural', '-1 em PE, planos rejeitam sua presença', 'Adaptabilidade'),
('presenca-instavel', 'Presença Instável', 'Carga planar alta não contida', 2, 'sobrenatural', 'Pode ser detectado mesmo em stealth mágico', 'Subversão'),
('marcado-por-sheol', 'Marcado por Sheol', 'Sobreviveu a julgamento em plano externo', 2, 'sobrenatural', 'Sofre +1 de dano simbólico contra ataques judiciais', 'Fortaleza');

