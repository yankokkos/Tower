<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Character;
use TowerRPG\Utils\ResponseFormatter;

class CharacterController
{
    private Character $characterModel;

    public function __construct()
    {
        $this->characterModel = new Character();
    }

    public function list(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $queryParams = $request->getQueryParams();

        if (isset($queryParams['campaign_id'])) {
            $characters = $this->characterModel->findByCampaign($queryParams['campaign_id']);
        } elseif (isset($queryParams['player_id'])) {
            // Apenas o próprio jogador ou mestre pode ver
            if ($user['role'] !== 'master' && $queryParams['player_id'] !== $user['id']) {
                return ResponseFormatter::forbidden($response);
            }
            $characters = $this->characterModel->findByPlayer($queryParams['player_id']);
        } else {
            // Se for mestre, pode ver todos; se for jogador, apenas os seus
            if ($user['role'] === 'master') {
                // Retornar todos seria muito pesado, melhor exigir filtro
                return ResponseFormatter::error($response, 'Especifique campaign_id ou player_id', 400);
            }
            $characters = $this->characterModel->findByPlayer($user['id']);
        }

        return ResponseFormatter::success($response, $characters);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $character = $this->characterModel->findById($args['id']);

        if (!$character) {
            return ResponseFormatter::notFound($response, 'Personagem não encontrado');
        }

        // Verificar permissão
        if ($user['role'] === 'player' && $character['player_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Você não tem permissão para ver este personagem');
        }

        return ResponseFormatter::success($response, $character);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        // Validações básicas
        if (empty($data['name']) || strlen($data['name']) < 2) {
            return ResponseFormatter::error($response, 'Nome deve ter no mínimo 2 caracteres', 400);
        }

        if (empty($data['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        // Jogador só pode criar para si mesmo
        if ($user['role'] === 'player') {
            $data['player_id'] = $user['id'];
        }

        $data['created_by'] = $user['id'];
        $data['last_modified_by'] = $user['id'];

        $characterId = $this->characterModel->create($data);
        $character = $this->characterModel->findById($characterId);

        return ResponseFormatter::success($response, $character, 'Personagem criado com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $character = $this->characterModel->findById($args['id']);

        if (!$character) {
            return ResponseFormatter::notFound($response, 'Personagem não encontrado');
        }

        // Verificar permissão
        if ($user['role'] === 'player' && $character['player_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Você não tem permissão para editar este personagem');
        }

        $data = $request->getParsedBody();
        $data['last_modified_by'] = $user['id'];

        $this->characterModel->update($args['id'], $data);
        $updatedCharacter = $this->characterModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedCharacter, 'Personagem atualizado com sucesso');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $character = $this->characterModel->findById($args['id']);

        if (!$character) {
            return ResponseFormatter::notFound($response, 'Personagem não encontrado');
        }

        // Verificar permissão
        if ($user['role'] === 'player' && $character['player_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Você não tem permissão para deletar este personagem');
        }

        $this->characterModel->delete($args['id']);

        return ResponseFormatter::success($response, null, 'Personagem deletado com sucesso');
    }
}

