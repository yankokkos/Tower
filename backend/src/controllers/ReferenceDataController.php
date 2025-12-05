<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Database\Database;
use TowerRPG\Utils\ResponseFormatter;
use PDO;

class ReferenceDataController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getPlanes(Request $request, Response $response): Response
    {
        $stmt = $this->db->query("SELECT id, name, level, category, description FROM planes ORDER BY level, name");
        $planes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return ResponseFormatter::success($response, $planes);
    }

    public function getEquipmentTemplates(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $type = $queryParams['type'] ?? null;
        $category = $queryParams['category'] ?? null;

        $sql = "SELECT * FROM equipment_templates WHERE 1=1";
        $params = [];

        if ($type) {
            $sql .= " AND type = ?";
            $params[] = $type;
        }

        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }

        $sql .= " ORDER BY category, name";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decodificar campos JSON
        foreach ($equipment as &$item) {
            if (isset($item['special']) && is_string($item['special'])) {
                $item['special'] = json_decode($item['special'], true) ?: [];
            }
            if (isset($item['properties']) && is_string($item['properties'])) {
                $item['properties'] = json_decode($item['properties'], true) ?: null;
            }
        }

        return ResponseFormatter::success($response, $equipment);
    }

    public function getAdvantages(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $category = $queryParams['category'] ?? null;

        $sql = "SELECT * FROM advantages WHERE 1=1";
        $params = [];

        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }

        $sql .= " ORDER BY category, cost, name";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $advantages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Converter snake_case para camelCase
        foreach ($advantages as &$adv) {
            $adv['mechanicalEffect'] = $adv['mechanical_effect'] ?? null;
            unset($adv['mechanical_effect']);
        }

        return ResponseFormatter::success($response, $advantages);
    }

    public function getDisadvantages(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $category = $queryParams['category'] ?? null;

        $sql = "SELECT * FROM disadvantages WHERE 1=1";
        $params = [];

        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }

        $sql .= " ORDER BY category, xp_gain, name";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $disadvantages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Converter snake_case para camelCase
        foreach ($disadvantages as &$dis) {
            $dis['xpGain'] = $dis['xp_gain'] ?? null;
            $dis['attentionTheme'] = $dis['attention_theme'] ?? null;
            unset($dis['xp_gain'], $dis['attention_theme']);
        }

        return ResponseFormatter::success($response, $disadvantages);
    }
}

