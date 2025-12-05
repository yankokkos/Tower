<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\Document;
use TowerRPG\Utils\ResponseFormatter;

class DocumentController
{
    private Document $documentModel;

    public function __construct()
    {
        $this->documentModel = new Document();
    }

    public function list(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $queryParams = $request->getQueryParams();
        
        if (empty($queryParams['campaign_id'])) {
            return ResponseFormatter::error($response, 'campaign_id é obrigatório', 400);
        }

        $documents = $this->documentModel->findByCampaign($queryParams['campaign_id']);
        
        // Filtrar documentos privados se não for mestre
        if ($user['role'] !== 'master') {
            $documents = array_filter($documents, function($doc) use ($user) {
                if ($doc['is_private']) {
                    return false;
                }
                return in_array($user['id'], $doc['shared_with'] ?? []);
            });
        }

        return ResponseFormatter::success($response, array_values($documents));
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $document = $this->documentModel->findById($args['id']);

        if (!$document) {
            return ResponseFormatter::notFound($response, 'Documento não encontrado');
        }

        // Verificar permissão
        if ($document['is_private'] && $document['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response);
        }

        if (!$document['is_private'] && !in_array($user['id'], $document['shared_with'] ?? []) && $user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response);
        }

        return ResponseFormatter::success($response, $document);
    }

    public function create(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $data = $request->getParsedBody();

        if ($user['role'] !== 'master') {
            return ResponseFormatter::forbidden($response, 'Apenas mestres podem criar documentos');
        }

        if (empty($data['title']) || empty($data['campaign_id'])) {
            return ResponseFormatter::error($response, 'Título e campaign_id são obrigatórios', 400);
        }

        $data['master_id'] = $user['id'];
        $documentId = $this->documentModel->create($data);
        $document = $this->documentModel->findById($documentId);

        return ResponseFormatter::success($response, $document, 'Documento criado com sucesso', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        $document = $this->documentModel->findById($args['id']);

        if (!$document) {
            return ResponseFormatter::notFound($response, 'Documento não encontrado');
        }

        if ($document['master_id'] !== $user['id']) {
            return ResponseFormatter::forbidden($response, 'Apenas o criador pode editar este documento');
        }

        $data = $request->getParsedBody();
        $this->documentModel->update($args['id'], $data);
        $updatedDocument = $this->documentModel->findById($args['id']);

        return ResponseFormatter::success($response, $updatedDocument, 'Documento atualizado com sucesso');
    }
}

