<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Threat;
use TowerRPG\Utils\ResponseFormatter;

class ThreatController
{
    private Threat $threatModel;

    public function __construct()
    {
        $this->threatModel = new Threat();
    }

    public function list(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $threats = $this->threatModel->findByCampaign($queryParams['campaign_id']);
        return ResponseFormatter::success($response, $threats);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $threat = $this->threatModel->findById($args['id']);

        if (!$threat) {
            return ResponseFormatter::notFound($response, 'Ameaça não encontrada');
        }

        return ResponseFormatter::success($response, $threat);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar ameaças');
        }

        if (empty($data['name']) || empty($data['campaign_id']) || empty($data['code'])) {
            return ResponseFormatter::error($response, 'Nome, campaign_id e code são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $threatId = $this->threatModel->create($data);
        $threat = $this->threatModel->findById($threatId);

        return ResponseFormatter::success($response, $threat, 'Ameaça criada com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $threat = $this->threatModel->findById($args['id']);

        if (!$threat) {
            return ResponseFormatter::notFound($response, 'Ameaça não encontrada');
        }

        if ($threat['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o criador pode editar esta ameaça');
        }

        $data = $request->getParsedBody();
        $this->threatModel->update($args['id'], $data);
        $updatedThreat = $this->threatModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedThreat, 'Ameaça atualizada com sucesso');
    }
}

