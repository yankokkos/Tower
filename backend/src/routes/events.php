<?php

use Slim\App;
use TowerRPG\Controllers\EventController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $eventController = new EventController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/events', [$eventController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/events/{id}', [$eventController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/events', [$eventController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/events/{id}', [$eventController, 'update'])->add($authMiddleware);
};

