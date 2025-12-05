<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Campaign
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT c.*, u.name as master_name, u.email as master_email
            FROM campaigns c
            LEFT JOIN users u ON c.master_id = u.id
            WHERE c.id = ?
        ");
        $stmt->execute([$id]);
        $campaign = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($campaign) {
            $campaign['players'] = $this->getPlayers($id);
        }
        
        return $campaign ?: null;
    }

    public function findByMaster(string $masterId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM campaigns WHERE master_id = ? ORDER BY created_at DESC");
        $stmt->execute([$masterId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findByPlayer(string $playerId): array
    {
        $stmt = $this->db->prepare("
            SELECT c.*
            FROM campaigns c
            INNER JOIN campaign_players cp ON c.id = cp.campaign_id
            WHERE cp.player_id = ?
            ORDER BY c.created_at DESC
        ");
        $stmt->execute([$playerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO campaigns (id, name, description, master_id, status, started_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $id,
            $data['name'],
            $data['description'] ?? '',
            $data['master_id'],
            $data['status'] ?? 'active'
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = ['name', 'description', 'status', 'started_at', 'completed_at'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $values[] = $id;
        $stmt = $this->db->prepare("UPDATE campaigns SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function addPlayer(string $campaignId, string $playerId): bool
    {
        $stmt = $this->db->prepare("
            INSERT IGNORE INTO campaign_players (campaign_id, player_id)
            VALUES (?, ?)
        ");
        return $stmt->execute([$campaignId, $playerId]);
    }

    public function removePlayer(string $campaignId, string $playerId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM campaign_players WHERE campaign_id = ? AND player_id = ?");
        return $stmt->execute([$campaignId, $playerId]);
    }

    private function getPlayers(string $campaignId): array
    {
        $stmt = $this->db->prepare("
            SELECT u.id, u.name, u.email, u.role
            FROM users u
            INNER JOIN campaign_players cp ON u.id = cp.player_id
            WHERE cp.campaign_id = ?
        ");
        $stmt->execute([$campaignId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM campaigns WHERE id = ?");
        return $stmt->execute([$id]);
    }
}

