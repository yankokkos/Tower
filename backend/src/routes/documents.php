<?php

use Slim\App;
use TowerRPG\Controllers\DocumentController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $documentController = new DocumentController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/documents', [$documentController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/documents/{id}', [$documentController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/documents', [$documentController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/documents/{id}', [$documentController, 'update'])->add($authMiddleware);
};

