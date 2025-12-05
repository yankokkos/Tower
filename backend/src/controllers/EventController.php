<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\CampaignEvent;
use TowerRPG\Utils\ResponseFormatter;

class EventController
{
    private CampaignEvent $eventModel;

    public function __construct()
    {
        $this->eventModel = new CampaignEvent();
    }

    public function list(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $events = $this->eventModel->findByCampaign($queryParams['campaign_id']);
        return ResponseFormatter::success($response, $events);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $event = $this->eventModel->findById($args['id']);

        if (!$event) {
            return ResponseFormatter::notFound($response, 'Evento não encontrado');
        }

        return ResponseFormatter::success($response, $event);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar eventos');
        }

        if (empty($data['title']) || empty($data['campaign_id'])) {
            return ResponseFormatter::error($response, 'Título e campaign_id são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $eventId = $this->eventModel->create($data);
        $event = $this->eventModel->findById($eventId);

        return ResponseFormatter::success($response, $event, 'Evento criado com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $event = $this->eventModel->findById($args['id']);

        if (!$event) {
            return ResponseFormatter::notFound($response, 'Evento não encontrado');
        }

        if ($event['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o criador pode editar este evento');
        }

        $data = $request->getParsedBody();
        $this->eventModel->update($args['id'], $data);
        $updatedEvent = $this->eventModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedEvent, 'Evento atualizado com sucesso');
    }
}

