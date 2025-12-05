<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Threat
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM threats WHERE id = ?");
        $stmt->execute([$id]);
        $threat = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($threat) {
            $threat = $this->decodeJsonFields($threat);
        }
        
        return $threat ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM threats WHERE campaign_id = ? ORDER BY created_at DESC");
        $stmt->execute([$campaignId]);
        $threats = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $threats);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO threats (
                id, campaign_id, master_id, name, code, type, origin_plane,
                description, capabilities, weaknesses, combat_stats,
                containment_level, danger_level, status, location,
                containment_procedures, discovery_date, incidents,
                related_missions, related_characters, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['name'],
            $data['code'],
            $data['type'],
            $data['origin_plane'] ?? null,
            $data['description'],
            json_encode($data['capabilities'] ?? []),
            json_encode($data['weaknesses'] ?? []),
            json_encode($data['combat_stats']),
            $data['containment_level'],
            $data['danger_level'],
            $data['status'] ?? 'to_capture',
            $data['location'] ?? null,
            $data['containment_procedures'] ?? null,
            $data['discovery_date'] ?? null,
            json_encode($data['incidents'] ?? []),
            json_encode($data['related_missions'] ?? []),
            json_encode($data['related_characters'] ?? []),
            $data['notes'] ?? ''
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'name', 'code', 'type', 'origin_plane', 'description', 'capabilities',
            'weaknesses', 'combat_stats', 'containment_level', 'danger_level',
            'status', 'location', 'containment_procedures', 'discovery_date',
            'incidents', 'related_missions', 'related_characters', 'notes'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $value = $data[$field];
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
        $stmt = $this->db->prepare("UPDATE threats SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM threats WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $threat): array
    {
        $jsonFields = [
            'capabilities', 'weaknesses', 'combat_stats', 'incidents',
            'related_missions', 'related_characters'
        ];

        foreach ($jsonFields as $field) {
            if (isset($threat[$field]) && is_string($threat[$field])) {
                $threat[$field] = json_decode($threat[$field], true);
            }
        }

        return $threat;
    }
}

