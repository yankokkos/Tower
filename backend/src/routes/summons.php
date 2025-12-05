<?php

use Slim\App;
use TowerRPG\Controllers\SummonController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $summonController = new SummonController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/summons', [$summonController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/summons/{id}', [$summonController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/summons', [$summonController, 'create'])->add($authMiddleware);
    $app->post('/api/v1/summons/{id}/confirm', [$summonController, 'confirm'])->add($authMiddleware);
    $app->post('/api/v1/summons/{id}/decline', [$summonController, 'decline'])->add($authMiddleware);
};

