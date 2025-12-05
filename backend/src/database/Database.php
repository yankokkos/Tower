<?php

namespace TowerRPG\Database;

use PDO;
use PDOException;
use Dotenv\Dotenv;

class Database
{
    private static ?PDO $instance = null;
    private static array $config = [];

    private function __construct()
    {
        // Private constructor to prevent direct instantiation
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            self::loadConfig();
            self::$instance = self::createConnection();
        }

        return self::$instance;
    }

    private static function loadConfig(): void
    {
        // Tentar encontrar config.env na raiz do projeto
        // Primeiro tenta relativo ao backend, depois tenta relativo à raiz
        $possiblePaths = [
            dirname(__DIR__, 2) . '/../../config.env',  // Raiz do projeto
            dirname(__DIR__, 3) . '/config.env',         // Alternativa
            __DIR__ . '/../../../../config.env'          // Se estiver em build/api
        ];
        
        $envPath = null;
        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                $envPath = dirname($path);
                break;
            }
        }
        
        if ($envPath && file_exists($envPath . '/config.env')) {
            $dotenv = Dotenv::createImmutable($envPath, 'config.env');
            $dotenv->load();
        }

        self::$config = [
            'host' => $_ENV['DB_HOST'] ?? 'localhost',
            'dbname' => $_ENV['DB_NAME'] ?? 'tower_rpg',
            'user' => $_ENV['DB_USER'] ?? 'root',
            'pass' => $_ENV['DB_PASS'] ?? '',
            'port' => $_ENV['DB_PORT'] ?? '3306',
            'charset' => 'utf8mb4'
        ];
    }

    private static function createConnection(): PDO
    {
        $dsn = sprintf(
            "mysql:host=%s;port=%s;dbname=%s;charset=%s",
            self::$config['host'],
            self::$config['port'],
            self::$config['dbname'],
            self::$config['charset']
        );

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 10, // Timeout de 10 segundos para conexões remotas
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, time_zone = '+00:00'"
        ];

        try {
            $pdo = new PDO($dsn, self::$config['user'], self::$config['pass'], $options);
            return $pdo;
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new \RuntimeException("Database connection failed", 0, $e);
        }
    }

    public static function testConnection(): bool
    {
        try {
            $pdo = self::getInstance();
            $pdo->query("SELECT 1");
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}

