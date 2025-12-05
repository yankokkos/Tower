<?php

use Slim\App;
use TowerRPG\Controllers\ReferenceDataController;

return function (App $app) {
    $controller = new ReferenceDataController();

    // Planos de Origem
    $app->get('/api/v1/reference/planes', [$controller, 'getPlanes']);

    // Templates de Equipamentos
    $app->get('/api/v1/reference/equipment', [$controller, 'getEquipmentTemplates']);

    // Vantagens
    $app->get('/api/v1/reference/advantages', [$controller, 'getAdvantages']);

    // Desvantagens
    $app->get('/api/v1/reference/disadvantages', [$controller, 'getDisadvantages']);
};

