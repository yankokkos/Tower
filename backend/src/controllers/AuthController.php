<?php

namespace TowerRPG\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use TowerRPG\Models\User;
use TowerRPG\Services\JwtService;
use TowerRPG\Utils\ResponseFormatter;

class AuthController
{
    private User $userModel;
    private JwtService $jwtService;

    public function __construct()
    {
        $this->userModel = new User();
        $this->jwtService = new JwtService();
    }

    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        if (empty($data['email']) || empty($data['password'])) {
            return ResponseFormatter::error($response, 'Email e senha são obrigatórios', 400);
        }

        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !$this->userModel->verifyPassword($data['password'], $user['password'])) {
            return ResponseFormatter::error($response, 'Credenciais inválidas', 401);
        }

        // Atualizar último login
        $this->userModel->updateLastLogin($user['id']);

        // Gerar token JWT
        $token = $this->jwtService->generateToken([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        // Remover senha da resposta
        unset($user['password']);

        return ResponseFormatter::success($response, [
            'user' => $user,
            'token' => $token
        ], 'Login realizado com sucesso');
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validações
        if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
            return ResponseFormatter::error($response, 'Email, senha e nome são obrigatórios', 400);
        }

        if (strlen($data['password']) < 8) {
            return ResponseFormatter::error($response, 'Senha deve ter no mínimo 8 caracteres', 400);
        }

        if (strlen($data['name']) < 2) {
            return ResponseFormatter::error($response, 'Nome deve ter no mínimo 2 caracteres', 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ResponseFormatter::error($response, 'Email inválido', 400);
        }

        if ($this->userModel->exists($data['email'])) {
            return ResponseFormatter::error($response, 'Email já cadastrado', 409);
        }

        // Criar usuário
        $userId = $this->userModel->create([
            'email' => $data['email'],
            'password' => $data['password'],
            'name' => $data['name'],
            'role' => $data['role'] ?? 'player'
        ]);

        // Buscar usuário criado
        $user = $this->userModel->findById($userId);

        // Gerar token
        $token = $this->jwtService->generateToken([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        return ResponseFormatter::success($response, [
            'user' => $user,
            'token' => $token
        ], 'Usuário criado com sucesso', 201);
    }
}

