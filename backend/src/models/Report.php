<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Report
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM reports WHERE id = ?");
        $stmt->execute([$id]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($report) {
            $report = $this->decodeJsonFields($report);
        }
        
        return $report ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM reports WHERE campaign_id = ? ORDER BY date DESC, created_at DESC");
        $stmt->execute([$campaignId]);
        $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $reports);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO reports (
                id, campaign_id, master_id, title, content, type, date,
                tags, is_private, shared_with
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['title'],
            $data['content'],
            $data['type'],
            $data['date'],
            json_encode($data['tags'] ?? []),
            $data['is_private'] ?? false,
            json_encode($data['shared_with'] ?? [])
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'title', 'content', 'type', 'date', 'tags', 'is_private', 'shared_with'
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
        $stmt = $this->db->prepare("UPDATE reports SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM reports WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $report): array
    {
        $jsonFields = ['tags', 'shared_with'];

        foreach ($jsonFields as $field) {
            if (isset($report[$field]) && is_string($report[$field])) {
                $report[$field] = json_decode($report[$field], true);
            }
        }

        return $report;
    }
}

