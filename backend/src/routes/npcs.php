<?php

use Slim\App;
use TowerRPG\Controllers\NPCController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $npcController = new NPCController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/npcs', [$npcController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/npcs/{id}', [$npcController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/npcs', [$npcController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/npcs/{id}', [$npcController, 'update'])->add($authMiddleware);
};

