#!/bin/bash
# Script para inicializar o banco de dados no Docker

set -e

echo "Aguardando MySQL estar pronto..."
until mysqladmin ping -h db -u root -p${MYSQL_ROOT_PASSWORD} --silent; do
    sleep 2
done

echo "MySQL está pronto!"

# Criar banco de dados se não existir
mysql -h db -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;
EOF

echo "Banco de dados ${DB_NAME} criado!"

# Executar scripts SQL
if [ -f "/docker-entrypoint-initdb.d/install-tables.sql" ]; then
    echo "Executando install-tables.sql..."
    mysql -h db -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < /docker-entrypoint-initdb.d/install-tables.sql
fi

if [ -f "/docker-entrypoint-initdb.d/setup-reference-data.sql" ]; then
    echo "Executando setup-reference-data.sql..."
    mysql -h db -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < /docker-entrypoint-initdb.d/setup-reference-data.sql
fi

if [ -f "/docker-entrypoint-initdb.d/create-test-users.sql" ]; then
    echo "Executando create-test-users.sql..."
    mysql -h db -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < /docker-entrypoint-initdb.d/create-test-users.sql
fi

echo "Banco de dados inicializado com sucesso!"

