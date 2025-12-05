<?php

use Slim\Factory\AppFactory;
use TowerRPG\Middleware\CorsMiddleware;
use TowerRPG\Middleware\ErrorHandler;

// Carregar autoload do Composer
$autoloadPaths = [
    __DIR__ . '/../../vendor/autoload.php',  // Desenvolvimento
    __DIR__ . '/../vendor/autoload.php'      // Build (build/api)
];

$autoloadPath = null;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        $autoloadPath = $path;
        break;
    }
}

if (!$autoloadPath) {
    die('Composer autoload não encontrado. Execute: composer install');
}

require $autoloadPath;

// Carregar variáveis de ambiente
// Tentar encontrar config.env na raiz do projeto
$possiblePaths = [
    dirname(__DIR__, 2) . '/../../config.env',  // Raiz do projeto
    dirname(__DIR__, 3) . '/config.env',         // Alternativa
    __DIR__ . '/../../../config.env'             // Se estiver em build/api
];

$envPath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $envPath = dirname($path);
        break;
    }
}

if ($envPath && file_exists($envPath . '/config.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable($envPath, 'config.env');
    $dotenv->load();
}

// Criar aplicação Slim
$app = AppFactory::create();

// Middleware de CORS
$app->add(new CorsMiddleware());

// Middleware de tratamento de erros
$app->add(new ErrorHandler());

// Middleware para parsing JSON
$app->addBodyParsingMiddleware();

// Middleware para OPTIONS (preflight)
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// Carregar rotas
$routeFiles = glob(__DIR__ . '/../src/routes/*.php');
foreach ($routeFiles as $routeFile) {
    $route = require $routeFile;
    $route($app);
};

// Rota catch-all para 404
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    return TowerRPG\Utils\ResponseFormatter::notFound($response, 'Rota não encontrada');
});

$app->run();

