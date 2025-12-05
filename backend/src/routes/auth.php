<?php

use Slim\App;
use TowerRPG\Controllers\AuthController;

return function (App $app) {
    $authController = new AuthController();

    $app->post('/api/v1/auth/login', [$authController, 'login']);
    $app->post('/api/v1/auth/register', [$authController, 'register']);
};

