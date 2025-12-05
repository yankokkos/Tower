<?php

/**
 * Script para testar conexão com o banco de dados
 * Execute: php backend/scripts/test-connection.php
 */

require __DIR__ . '/../../vendor/autoload.php';

// Carregar config.env
$envPath = dirname(__DIR__, 2);
if (file_exists($envPath . '/config.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable($envPath, 'config.env');
    $dotenv->load();
}

echo "=== Teste de Conexão com Banco de Dados ===\n\n";

$host = $_ENV['DB_HOST'] ?? 'localhost';
$dbname = $_ENV['DB_NAME'] ?? '';
$user = $_ENV['DB_USER'] ?? '';
$port = $_ENV['DB_PORT'] ?? '3306';

echo "Host: $host\n";
echo "Database: $dbname\n";
echo "User: $user\n";
echo "Port: $port\n\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $_ENV['DB_PASS'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10
    ]);
    
    echo "✓ Conexão estabelecida com sucesso!\n\n";
    
    // Testar query
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✓ Query de teste executada: " . $result['test'] . "\n\n";
    
    // Verificar tabelas existentes
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Tabelas existentes no banco:\n";
    if (empty($tables)) {
        echo "  (nenhuma tabela encontrada - execute o script de migrations)\n";
    } else {
        foreach ($tables as $table) {
            echo "  - $table\n";
        }
    }
    
    echo "\n✓ Teste concluído com sucesso!\n";
    
} catch (PDOException $e) {
    echo "✗ Erro na conexão:\n";
    echo "  " . $e->getMessage() . "\n";
    echo "\nVerifique:\n";
    echo "  1. As credenciais no config.env estão corretas?\n";
    echo "  2. O servidor MySQL está acessível?\n";
    echo "  3. O banco de dados existe?\n";
    echo "  4. O usuário tem permissões adequadas?\n";
    exit(1);
}

