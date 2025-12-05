<?php

use Slim\App;
use TowerRPG\Controllers\ThreatController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $threatController = new ThreatController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/threats', [$threatController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/threats/{id}', [$threatController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/threats', [$threatController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/threats/{id}', [$threatController, 'update'])->add($authMiddleware);
};

