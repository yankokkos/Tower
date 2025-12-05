<?php

namespace TowerRPG\Utils;

use Psr\Http\Message\ResponseInterface as Response;

class ResponseFormatter
{
    public static function success(Response $response, $data = null, string $message = 'Success', int $statusCode = 200): Response
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];

        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($statusCode);
    }

    public static function error(Response $response, string $message = 'Error', int $statusCode = 400, array $errors = []): Response
    {
        $payload = [
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ];

        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($statusCode);
    }

    public static function unauthorized(Response $response, string $message = 'Unauthorized'): Response
    {
        return self::error($response, $message, 401);
    }

    public static function forbidden(Response $response, string $message = 'Forbidden'): Response
    {
        return self::error($response, $message, 403);
    }

    public static function notFound(Response $response, string $message = 'Not found'): Response
    {
        return self::error($response, $message, 404);
    }
}

