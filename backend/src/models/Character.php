<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Character
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM characters WHERE id = ?");
        $stmt->execute([$id]);
        $character = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($character) {
            $character = $this->decodeJsonFields($character);
            $character = $this->convertToCamelCase($character);
        }
        
        return $character ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM characters WHERE campaign_id = ? ORDER BY created_at DESC");
        $stmt->execute([$campaignId]);
        $characters = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($char) {
            $char = $this->decodeJsonFields($char);
            return $this->convertToCamelCase($char);
        }, $characters);
    }

    public function findByPlayer(string $playerId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM characters WHERE player_id = ? ORDER BY created_at DESC");
        $stmt->execute([$playerId]);
        $characters = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($char) {
            $char = $this->decodeJsonFields($char);
            return $this->convertToCamelCase($char);
        }, $characters);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();
        
        // Converter camelCase para snake_case
        $data = $this->convertToSnakeCase($data);
        
        // Calcular status derivados
        $statusDerived = $this->calculateStatusDerived($data);
        
        $stmt = $this->db->prepare("
            INSERT INTO characters (
                id, campaign_id, player_id, name, codename, concept, origin, age, appearance, motivation,
                code, rank, division, recruitment_date, status,
                attributes, status_derived, skills, advantages, disadvantages,
                labels, inner_plane, seeds, power_themes, power_cards,
                equipment, history, relationships, xp, xp_total, level, xp_history, attention,
                created_by, last_modified_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['player_id'],
            $data['name'],
            $data['codename'] ?? null,
            $data['concept'],
            $data['origin'],
            $data['age'],
            $data['appearance'] ?? null,
            $data['motivation'] ?? null,
            $data['code'] ?? null,
            $data['rank'] ?? null,
            $data['division'] ?? null,
            $data['recruitment_date'] ?? null,
            $data['status'] ?? 'active',
            json_encode($data['attributes']),
            json_encode($statusDerived),
            json_encode($data['skills'] ?? []),
            json_encode($data['advantages'] ?? []),
            json_encode($data['disadvantages'] ?? []),
            json_encode($data['labels']),
            json_encode($data['inner_plane']),
            json_encode($data['seeds'] ?? []),
            json_encode($data['power_themes'] ?? []),
            json_encode($data['power_cards'] ?? []),
            json_encode($data['equipment'] ?? []),
            $data['history'] ?? '',
            json_encode($data['relationships'] ?? []),
            $data['xp'] ?? 0,
            $data['xp_total'] ?? 0,
            $data['level'] ?? null,
            json_encode($data['xp_history'] ?? []),
            json_encode($data['attention'] ?? []),
            $data['created_by'],
            $data['last_modified_by']
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        // Converter camelCase para snake_case
        $data = $this->convertToSnakeCase($data);
        
        // Recalcular status derivados se atributos ou equipamentos mudaram
        if (isset($data['attributes']) || isset($data['equipment'])) {
            $current = $this->findById($id);
            if ($current) {
                // Converter de volta para snake_case para cálculo
                $currentSnake = $this->convertToSnakeCase($current);
                $merged = array_merge($currentSnake, $data);
                $data['status_derived'] = $this->calculateStatusDerived($merged);
            }
        }

        $fields = [];
        $values = [];

        $allowedFields = [
            'name', 'codename', 'concept', 'origin', 'age', 'appearance', 'motivation',
            'code', 'rank', 'division', 'recruitment_date', 'status', 'attributes', 'status_derived',
            'skills', 'advantages', 'disadvantages', 'labels', 'inner_plane',
            'seeds', 'power_themes', 'power_cards', 'equipment', 'history',
            'relationships', 'xp', 'xp_total', 'level', 'xp_history', 'attention', 'last_modified_by'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $value = $data[$field];
                // Converter arrays/objetos para JSON
                if (is_array($value) || is_object($value)) {
                    $value = json_encode($value);
                }
                $values[] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $values[] = $id;
        $stmt = $this->db->prepare("UPDATE characters SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM characters WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function calculateStatusDerived(array $data): array
    {
        $attributes = $data['attributes'] ?? [];
        $equipment = $data['equipment'] ?? [];
        $advantages = $data['advantages'] ?? [];
        $seeds = $data['seeds'] ?? [];

        // PV = Constituição × 5 + bônus de armadura
        $armorDefense = 0;
        foreach ($equipment as $item) {
            if (($item['equipped'] ?? false) && ($item['type'] ?? '') === 'armor') {
                $armorDefense += $item['properties']['defense'] ?? 0;
            }
        }
        $pv = ($attributes['constituicao'] ?? 1) * 5 + $armorDefense;

        // PS = Sabedoria × 5 + bônus de vantagens
        $psBonus = 0;
        foreach ($advantages as $adv) {
            if (strpos($adv['mechanicalEffect'] ?? '', 'PS') !== false) {
                $psBonus += 5;
            }
        }
        $ps = ($attributes['sabedoria'] ?? 1) * 5 + $psBonus;

        // PE = Poder × 5 + bônus de Seeds (+10 se tiver Seed ativa)
        $peBonus = 0;
        $hasActiveSeed = false;
        foreach ($seeds as $seed) {
            if ($seed['isActive'] ?? false) {
                $hasActiveSeed = true;
                $peBonus += ($seed['level'] ?? 0) * 2;
            }
        }
        if ($hasActiveSeed) {
            $peBonus += 10; // Bônus base por ter Seed ativa
        }
        $pe = ($attributes['poder'] ?? 1) * 5 + $peBonus;

        // Defesa = 10 + Destreza + bônus de armadura
        $armorDefenseBonus = 0;
        foreach ($equipment as $item) {
            if (($item['equipped'] ?? false) && ($item['type'] ?? '') === 'armor') {
                $armorDefenseBonus += abs($item['properties']['damageReduction'] ?? 0);
            }
        }
        $defense = 10 + ($attributes['destreza'] ?? 1) + $armorDefenseBonus;
        
        // Iniciativa = Destreza + modificadores
        $initiative = $attributes['destreza'] ?? 1;

        return [
            'pv' => $pv,
            'pvMax' => $pv,
            'ps' => $ps,
            'psMax' => $ps,
            'pe' => $pe,
            'peMax' => $pe,
            'defense' => $defense,
            'initiative' => $initiative
        ];
    }

    private function decodeJsonFields(array $character): array
    {
        $jsonFields = [
            'attributes', 'status_derived', 'skills', 'advantages', 'disadvantages',
            'labels', 'inner_plane', 'seeds', 'power_themes', 'power_cards',
            'equipment', 'relationships', 'xp_history', 'attention'
        ];

        foreach ($jsonFields as $field) {
            if (isset($character[$field]) && is_string($character[$field])) {
                $decoded = json_decode($character[$field], true);
                $character[$field] = $decoded !== null ? $decoded : ($field === 'attention' ? [] : []);
            } elseif (!isset($character[$field])) {
                // Garantir que campos opcionais tenham valores padrão
                if ($field === 'attention' || $field === 'xp_history') {
                    $character[$field] = [];
                }
            }
        }

        return $character;
    }

    private function convertToCamelCase(array $data): array
    {
        $result = [];
        $mappings = [
            'status_derived' => 'statusDerived',
            'inner_plane' => 'innerPlane',
            'power_themes' => 'powerThemes',
            'power_cards' => 'powerCards',
            'xp_history' => 'xpHistory',
            'xp_total' => 'xpTotal',
            'player_id' => 'playerId',
            'campaign_id' => 'campaignId',
            'created_by' => 'createdBy',
            'last_modified_by' => 'lastModifiedBy',
            'recruitment_date' => 'recruitmentDate',
            'created_at' => 'createdAt',
            'updated_at' => 'updatedAt'
        ];

        foreach ($data as $key => $value) {
            if (isset($mappings[$key])) {
                $result[$mappings[$key]] = $value;
            } else {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    private function convertToSnakeCase(array $data): array
    {
        $result = [];
        $mappings = [
            'statusDerived' => 'status_derived',
            'innerPlane' => 'inner_plane',
            'powerThemes' => 'power_themes',
            'powerCards' => 'power_cards',
            'xpHistory' => 'xp_history',
            'xpTotal' => 'xp_total',
            'playerId' => 'player_id',
            'campaignId' => 'campaign_id',
            'createdBy' => 'created_by',
            'lastModifiedBy' => 'last_modified_by',
            'recruitmentDate' => 'recruitment_date',
            'createdAt' => 'created_at',
            'updatedAt' => 'updated_at'
        ];

        foreach ($data as $key => $value) {
            if (isset($mappings[$key])) {
                $result[$mappings[$key]] = $value;
            } else {
                $result[$key] = $value;
            }
        }

        return $result;
    }
}

