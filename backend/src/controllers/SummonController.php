<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Summon;
use TowerRPG\Utils\ResponseFormatter;

class SummonController
{
    private Summon $summonModel;

    public function __construct()
    {
        $this->summonModel = new Summon();
    }

    public function list(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $summons = $this->summonModel->findByCampaign($queryParams['campaign_id']);
        return ResponseFormatter::success($response, $summons);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $summon = $this->summonModel->findById($args['id']);

        if (!$summon) {
            return ResponseFormatter::notFound($response, 'Convocação não encontrada');
        }

        return ResponseFormatter::success($response, $summon);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar convocações');
        }

        if (empty($data['title']) || empty($data['campaign_id']) || empty($data['scheduled_date'])) {
            return ResponseFormatter::error($response, 'Título, campaign_id e scheduled_date são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $summonId = $this->summonModel->create($data);
        $summon = $this->summonModel->findById($summonId);

        return ResponseFormatter::success($response, $summon, 'Convocação criada com sucesso', 201);
    }

    public function confirm(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        
        $success = $this->summonModel->confirmPlayer($args['id'], $user['id']);
        
        if (!$success) {
            return ResponseFormatter::error($response, 'Não foi possível confirmar participação', 400);
        }

        $summon = $this->summonModel->findById($args['id']);
        return ResponseFormatter::success($response, $summon, 'Participação confirmada');
    }

    public function decline(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        
        $success = $this->summonModel->declinePlayer($args['id'], $user['id']);
        
        if (!$success) {
            return ResponseFormatter::error($response, 'Não foi possível recusar participação', 400);
        }

        $summon = $this->summonModel->findById($args['id']);
        return ResponseFormatter::success($response, $summon, 'Participação recusada');
    }
}

