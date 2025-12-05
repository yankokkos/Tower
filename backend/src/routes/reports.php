<?php

use Slim\App;
use TowerRPG\Controllers\ReportController;
use TowerRPG\Middleware\AuthMiddleware;

return function (App $app) {
    $reportController = new ReportController();
    $authMiddleware = new AuthMiddleware();

    $app->get('/api/v1/reports', [$reportController, 'list'])->add($authMiddleware);
    $app->get('/api/v1/reports/{id}', [$reportController, 'get'])->add($authMiddleware);
    $app->post('/api/v1/reports', [$reportController, 'create'])->add($authMiddleware);
    $app->put('/api/v1/reports/{id}', [$reportController, 'update'])->add($authMiddleware);
};

