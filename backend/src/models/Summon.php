<?php

namespace TowerRPG\Models;

use TowerRPG\Database\Database;
use PDO;
use Ramsey\Uuid\Uuid;

class Summon
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM summons WHERE id = ?");
        $stmt->execute([$id]);
        $summon = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($summon) {
            $summon = $this->decodeJsonFields($summon);
        }
        
        return $summon ?: null;
    }

    public function findByCampaign(string $campaignId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM summons WHERE campaign_id = ? ORDER BY scheduled_date DESC");
        $stmt->execute([$campaignId]);
        $summons = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'decodeJsonFields'], $summons);
    }

    public function create(array $data): string
    {
        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("
            INSERT INTO summons (
                id, campaign_id, master_id, title, message, scheduled_date,
                invited_players, confirmed_players, declined_players, status,
                reminder_sent, reminder_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data['campaign_id'],
            $data['master_id'],
            $data['title'],
            $data['message'],
            $data['scheduled_date'],
            json_encode($data['invited_players'] ?? []),
            json_encode($data['confirmed_players'] ?? []),
            json_encode($data['declined_players'] ?? []),
            $data['status'] ?? 'pending',
            $data['reminder_sent'] ?? false,
            $data['reminder_date'] ?? null
        ]);

        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowedFields = [
            'title', 'message', 'scheduled_date', 'invited_players',
            'confirmed_players', 'declined_players', 'status',
            'reminder_sent', 'reminder_date'
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
        $stmt = $this->db->prepare("UPDATE summons SET " . implode(', ', $fields) . " WHERE id = ?");
        return $stmt->execute($values);
    }

    public function confirmPlayer(string $id, string $playerId): bool
    {
        $summon = $this->findById($id);
        if (!$summon) {
            return false;
        }

        $invited = $summon['invited_players'] ?? [];
        $confirmed = $summon['confirmed_players'] ?? [];
        $declined = $summon['declined_players'] ?? [];

        if (!in_array($playerId, $invited)) {
            return false;
        }

        // Remove de declined se estiver lá
        $declined = array_values(array_filter($declined, fn($p) => $p !== $playerId));
        
        // Adiciona a confirmed se não estiver
        if (!in_array($playerId, $confirmed)) {
            $confirmed[] = $playerId;
        }

        return $this->update($id, [
            'confirmed_players' => $confirmed,
            'declined_players' => $declined
        ]);
    }

    public function declinePlayer(string $id, string $playerId): bool
    {
        $summon = $this->findById($id);
        if (!$summon) {
            return false;
        }

        $invited = $summon['invited_players'] ?? [];
        $confirmed = $summon['confirmed_players'] ?? [];
        $declined = $summon['declined_players'] ?? [];

        if (!in_array($playerId, $invited)) {
            return false;
        }

        // Remove de confirmed se estiver lá
        $confirmed = array_values(array_filter($confirmed, fn($p) => $p !== $playerId));
        
        // Adiciona a declined se não estiver
        if (!in_array($playerId, $declined)) {
            $declined[] = $playerId;
        }

        return $this->update($id, [
            'confirmed_players' => $confirmed,
            'declined_players' => $declined
        ]);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM summons WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private function decodeJsonFields(array $summon): array
    {
        $jsonFields = ['invited_players', 'confirmed_players', 'declined_players'];

        foreach ($jsonFields as $field) {
            if (isset($summon[$field]) && is_string($summon[$field])) {
                $summon[$field] = json_decode($summon[$field], true);
            }
        }

        return $summon;
    }
}

