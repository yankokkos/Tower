<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\NPC;
use TowerRPG\Utils\ResponseFormatter;

class NPCController
{
    private NPC $npcModel;

    public function __construct()
    {
        $this->npcModel = new NPC();
    }

    public function list(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $npcs = $this->npcModel->findByCampaign($queryParams['campaign_id']);
        return ResponseFormatter::success($response, $npcs);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $npc = $this->npcModel->findById($args['id']);

        if (!$npc) {
            return ResponseFormatter::notFound($response, 'NPC não encontrado');
        }

        return ResponseFormatter::success($response, $npc);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar NPCs');
        }

        if (empty($data['name']) || empty($data['campaign_id'])) {
            return ResponseFormatter::error($response, 'Nome e campaign_id são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $npcId = $this->npcModel->create($data);
        $npc = $this->npcModel->findById($npcId);

        return ResponseFormatter::success($response, $npc, 'NPC criado com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $npc = $this->npcModel->findById($args['id']);

        if (!$npc) {
            return ResponseFormatter::notFound($response, 'NPC não encontrado');
        }

        if ($npc['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o criador pode editar este NPC');
        }

        $data = $request->getParsedBody();
        $this->npcModel->update($args['id'], $data);
        $updatedNPC = $this->npcModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedNPC, 'NPC atualizado com sucesso');
    }
}

