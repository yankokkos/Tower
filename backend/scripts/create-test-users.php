<?php
/**
 * Script para criar usuários de teste no banco de dados
 * Execute: php backend/scripts/create-test-users.php
 */

require __DIR__ . '/../vendor/autoload.php';

use TowerRPG\Database\Database;
use TowerRPG\Models\User;
use Ramsey\Uuid\Uuid;

// Carregar variáveis de ambiente
$envPath = dirname(__DIR__, 1);
if (file_exists($envPath . '/../config.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable($envPath . '/..', 'config.env');
    $dotenv->load();
}

$userModel = new User();

// Lista de usuários de teste para criar
$testUsers = [
    // Players
    ['email' => 'player1@tower.com', 'password' => 'player123', 'name' => 'Jogador Teste 1', 'role' => 'player'],
    ['email' => 'player2@tower.com', 'password' => 'player123', 'name' => 'Jogador Teste 2', 'role' => 'player'],
    ['email' => 'player3@tower.com', 'password' => 'player123', 'name' => 'Jogador Teste 3', 'role' => 'player'],
    ['email' => 'player4@tower.com', 'password' => 'player123', 'name' => 'Jogador Teste 4', 'role' => 'player'],
    ['email' => 'player5@tower.com', 'password' => 'player123', 'name' => 'Jogador Teste 5', 'role' => 'player'],
    
    // Master
    ['email' => 'master@tower.com', 'password' => 'master123', 'name' => 'Mestre Teste', 'role' => 'master'],
];

echo "=== Criando Usuários de Teste ===\n\n";

$created = 0;
$skipped = 0;

foreach ($testUsers as $userData) {
    // Verificar se usuário já existe
    if ($userModel->exists($userData['email'])) {
        echo "⏭️  Usuário {$userData['email']} já existe. Pulando...\n";
        $skipped++;
        continue;
    }
    
    try {
        $userId = $userModel->create($userData);
        echo "✅ Usuário criado: {$userData['email']} (ID: {$userId})\n";
        echo "   Email: {$userData['email']}\n";
        echo "   Senha: {$userData['password']}\n";
        echo "   Nome: {$userData['name']}\n";
        echo "   Role: {$userData['role']}\n\n";
        $created++;
    } catch (Exception $e) {
        echo "❌ Erro ao criar usuário {$userData['email']}: " . $e->getMessage() . "\n\n";
    }
}

echo "\n=== Resumo ===\n";
echo "✅ Criados: {$created}\n";
echo "⏭️  Pulados: {$skipped}\n";
echo "📊 Total: " . count($testUsers) . "\n\n";

echo "=== Credenciais de Acesso ===\n\n";
echo "PLAYERS:\n";
echo "  Email: player1@tower.com | Senha: player123\n";
echo "  Email: player2@tower.com | Senha: player123\n";
echo "  Email: player3@tower.com | Senha: player123\n";
echo "  Email: player4@tower.com | Senha: player123\n";
echo "  Email: player5@tower.com | Senha: player123\n\n";
echo "MASTER:\n";
echo "  Email: master@tower.com | Senha: master123\n\n";

