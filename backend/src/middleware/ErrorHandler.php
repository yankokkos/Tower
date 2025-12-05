<?php

namespace TowerRPG\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use TowerRPG\Utils\ResponseFormatter;

class ErrorHandler
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        try {
            return $handler->handle($request);
        } catch (\PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response = new \Slim\Psr7\Response();
            return ResponseFormatter::error($response, 'Database error occurred', 500);
        } catch (\Exception $e) {
            error_log("Error: " . $e->getMessage());
            $response = new \Slim\Psr7\Response();
            $message = $_ENV['API_DEBUG'] ?? false ? $e->getMessage() : 'An error occurred';
            return ResponseFormatter::error($response, $message, 500);
        }
    }
}

