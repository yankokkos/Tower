<?php

namespace TowerRPG\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use TowerRPG\Services\JwtService;
use TowerRPG\Utils\ResponseFormatter;

class AuthMiddleware
{
    private JwtService $jwtService;

    public function __construct()
    {
        $this->jwtService = new JwtService();
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $token = $this->jwtService->getTokenFromRequest($request);

        if (!$token) {
            $response = new \Slim\Psr7\Response();
            return ResponseFormatter::unauthorized($response, 'Token não fornecido');
        }

        $payload = $this->jwtService->validateToken($token);

        if (!$payload) {
            $response = new \Slim\Psr7\Response();
            return ResponseFormatter::unauthorized($response, 'Token inválido ou expirado');
        }

        // Adiciona dados do usuário autenticado à requisição
        $request = $request->withAttribute('user', $payload);

        return $handler->handle($request);
    }
}

