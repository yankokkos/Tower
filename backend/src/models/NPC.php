<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class NPC
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM npcs WHERE id = ?");
        $stmt->execute([$id]);
        $npc = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($npc) {
            $npc = $this->decodeJsonFields($npc);
        }
        
        return $npc ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM npcs WHERE campaign_id = ? ORDER BY created_at DESC");
        $stmt->execute([$campaignId]);
        $npcs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $npcs);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO npcs (
                id, campaign_id, master_id, name, description, affiliation,
                rank, age, appearance, attributes, skills, relationships,
                history, notes, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['name'],
            $data['description'],
            $data['affiliation'],
            $data['rank'] ?? null,
            $data['age'] ?? null,
            $data['appearance'] ?? null,
            isset($data['attributes']) ? json_encode($data['attributes']) : null,
            isset($data['skills']) ? json_encode($data['skills']) : null,
            json_encode($data['relationships'] ?? []),
            $data['history'] ?? '',
            $data['notes'] ?? '',
            $data['status'] ?? 'alive'
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'name', 'description', 'affiliation', 'rank', 'age', 'appearance',
            'attributes', 'skills', 'relationships', 'history', 'notes', 'status'
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
        $stmt = $this->db->prepare("UPDATE npcs SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM npcs WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $npc): array
    {
        $jsonFields = ['attributes', 'skills', 'relationships'];

        foreach ($jsonFields as $field) {
            if (isset($npc[$field]) && is_string($npc[$field])) {
                $npc[$field] = json_decode($npc[$field], true);
            }
        }

        return $npc;
    }
}

