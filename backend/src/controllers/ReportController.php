<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Report;
use TowerRPG\Utils\ResponseFormatter;

class ReportController
{
    private Report $reportModel;

    public function __construct()
    {
        $this->reportModel = new Report();
    }

    public function list(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $reports = $this->reportModel->findByCampaign($queryParams['campaign_id']);
        
        // Filtrar relatórios privados se não for mestre
        if ($user['role'] !== 'master') {
            $reports = array_filter($reports, function($report) use ($user) {
                if ($report['is_private']) {
                    return false;
                }
                return in_array($user['id'], $report['shared_with'] ?? []);
            });
        }

        return ResponseFormatter::success($response, array_values($reports));
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $report = $this->reportModel->findById($args['id']);

        if (!$report) {
            return ResponseFormatter::notFound($response, 'Relatório não encontrado');
        }

        // Verificar permissão
        if ($report['is_private'] && $report['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response);
        }

        if (!$report['is_private'] && !in_array($user['id'], $report['shared_with'] ?? []) && $user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response);
        }

        return ResponseFormatter::success($response, $report);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar relatórios');
        }

        if (empty($data['title']) || empty($data['campaign_id'])) {
            return ResponseFormatter::error($response, 'Título e campaign_id são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $reportId = $this->reportModel->create($data);
        $report = $this->reportModel->findById($reportId);

        return ResponseFormatter::success($response, $report, 'Relatório criado com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $report = $this->reportModel->findById($args['id']);

        if (!$report) {
            return ResponseFormatter::notFound($response, 'Relatório não encontrado');
        }

        if ($report['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o criador pode editar este relatório');
        }

        $data = $request->getParsedBody();
        $this->reportModel->update($args['id'], $data);
        $updatedReport = $this->reportModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedReport, 'Relatório atualizado com sucesso');
    }
}

