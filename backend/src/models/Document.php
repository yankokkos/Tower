<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Document
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $document = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($document) {
            $document = $this->decodeJsonFields($document);
        }
        
        return $document ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM documents WHERE campaign_id = ? ORDER BY created_at DESC");
        $stmt->execute([$campaignId]);
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $documents);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO documents (
                id, campaign_id, master_id, title, content, category,
                is_private, shared_with, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['title'],
            $data['content'],
            $data['category'],
            $data['is_private'] ?? false,
            json_encode($data['shared_with'] ?? []),
            json_encode($data['tags'] ?? [])
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'title', 'content', 'category', 'is_private', 'shared_with', 'tags'
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
        $stmt = $this->db->prepare("UPDATE documents SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM documents WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $document): array
    {
        $jsonFields = ['shared_with', 'tags'];

        foreach ($jsonFields as $field) {
            if (isset($document[$field]) && is_string($document[$field])) {
                $document[$field] = json_decode($document[$field], true);
            }
        }

        return $document;
    }
}

