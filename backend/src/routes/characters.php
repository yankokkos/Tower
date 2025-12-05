<?php

use Slim\App;
use TowerRPG\Controllers\CharacterController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $characterController = new CharacterController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/characters', [$characterController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/characters/{id}', [$characterController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/characters', [$characterController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/characters/{id}', [$characterController, 'update'])->add($authMiddleware);
    $app->delete('/api/v1/characters/{id}', [$characterController, 'delete'])->add($authMiddleware);
};

