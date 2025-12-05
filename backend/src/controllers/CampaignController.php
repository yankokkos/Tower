<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Campaign;
use TowerRPG\Utils\ResponseFormatter;

class CampaignController
{
    private Campaign $campaignModel;

    public function __construct()
    {
        $this->campaignModel = new Campaign();
    }

    public function list(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $role = $user['role'] ?? 'player';

        if ($role === 'master') {
            $campaigns = $this->campaignModel->findByMaster($user['id']);
        } else {
            $campaigns = $this->campaignModel->findByPlayer($user['id']);
        }

        return ResponseFormatter::success($response, $campaigns);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $campaign = $this->campaignModel->findById($args['id']);

        if (!$campaign) {
            return ResponseFormatter::notFound($response, 'Campanha não encontrada');
        }

        return ResponseFormatter::success($response, $campaign);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar campanhas');
        }

        $data = $request->getParsedBody();

        if (empty($data['name']) || strlen($data['name']) < 3) {
            return ResponseFormatter::error($response, 'Nome da campanha deve ter no mínimo 3 caracteres', 400);
        }

        $campaignId = $this->campaignModel->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'master_id' => $user['id'],
            'status' => $data['status'] ?? 'active'
        ]);

        $campaign = $this->campaignModel->findById($campaignId);

        return ResponseFormatter::success($response, $campaign, 'Campanha criada com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $campaign = $this->campaignModel->findById($args['id']);

        if (!$campaign) {
            return ResponseFormatter::notFound($response, 'Campanha não encontrada');
        }

        if ($campaign['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o mestre da campanha pode editá-la');
        }

        $data = $request->getParsedBody();
        $this->campaignModel->update($args['id'], $data);

        $updatedCampaign = $this->campaignModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedCampaign, 'Campanha atualizada com sucesso');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $campaign = $this->campaignModel->findById($args['id']);

        if (!$campaign) {
            return ResponseFormatter::notFound($response, 'Campanha não encontrada');
        }

        if ($campaign['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o mestre da campanha pode deletá-la');
        }

        $this->campaignModel->delete($args['id']);

        return ResponseFormatter::success($response, null, 'Campanha deletada com sucesso');
    }
}

