<?php

use Slim\App;
use TowerRPG\Controllers\CampaignController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $campaignController = new CampaignController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/campaigns', [$campaignController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/campaigns/{id}', [$campaignController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/campaigns', [$campaignController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/campaigns/{id}', [$campaignController, 'update'])->add($authMiddleware);
    $app->delete('/api/v1/campaigns/{id}', [$campaignController, 'delete'])->add($authMiddleware);
};

