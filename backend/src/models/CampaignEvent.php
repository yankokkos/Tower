<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class CampaignEvent
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM campaign_events WHERE id = ?");
        $stmt->execute([$id]);
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($event) {
            $event = $this->decodeJsonFields($event);
        }
        
        return $event ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM campaign_events WHERE campaign_id = ? ORDER BY date DESC, created_at DESC");
        $stmt->execute([$campaignId]);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $events);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO campaign_events (
                id, campaign_id, master_id, title, description, type, date,
                related_characters, related_threats, related_npcs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['title'],
            $data['description'],
            $data['type'],
            $data['date'],
            json_encode($data['related_characters'] ?? []),
            json_encode($data['related_threats'] ?? []),
            json_encode($data['related_npcs'] ?? [])
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'title', 'description', 'type', 'date',
            'related_characters', 'related_threats', 'related_npcs'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $value = $data[$field];
                if (is_array($value)) {
                    $value = json_encode($value);
                }
                $values[] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $values[] = $id;
        $stmt = $this->db->prepare("UPDATE campaign_events SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM campaign_events WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $event): array
    {
        $jsonFields = ['related_characters', 'related_threats', 'related_npcs'];

        foreach ($jsonFields as $field) {
            if (isset($event[$field]) && is_string($event[$field])) {
                $event[$field] = json_decode($event[$field], true);
            }
        }

        return $event;
    }
}

