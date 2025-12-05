.PHONY: help build up down restart logs clean init-db test

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Faz build dos containers
	docker-compose build

up: ## Inicia os containers
	docker-compose up -d

down: ## Para os containers
	docker-compose down

restart: ## Reinicia os containers
	docker-compose restart

logs: ## Mostra logs de todos os containers
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs do frontend
	docker-compose logs -f frontend

logs-db: ## Mostra logs do banco de dados
	docker-compose logs -f db

init-db: ## Inicializa o banco de dados com scripts SQL
	@echo "Aguardando MySQL estar pronto..."
	@sleep 15
	@echo "Executando scripts SQL..."
	docker exec -i tower-mysql mysql -u root -p$${MYSQL_ROOT_PASSWORD:-rootpassword} < backend/database/install-tables.sql
	docker exec -i tower-mysql mysql -u root -p$${MYSQL_ROOT_PASSWORD:-rootpassword} $${DB_NAME:-tower_rpg} < backend/database/setup-reference-data.sql
	docker exec -i tower-mysql mysql -u root -p$${MYSQL_ROOT_PASSWORD:-rootpassword} $${DB_NAME:-tower_rpg} < backend/database/create-test-users.sql
	@echo "Banco de dados inicializado!"

clean: ## Remove containers, volumes e imagens
	docker-compose down -v
	docker system prune -f

shell-backend: ## Acessa shell do container backend
	docker exec -it tower-backend bash

shell-db: ## Acessa MySQL shell
	docker exec -it tower-mysql mysql -u root -p$${MYSQL_ROOT_PASSWORD:-rootpassword}

status: ## Mostra status dos containers
	docker-compose ps

start: build up init-db ## Build, inicia containers e inicializa banco de dados
	@echo ""
	@echo "✅ Aplicação iniciada!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 API: http://localhost:8080/api"

prod-build: ## Build para produção
	docker-compose -f docker-compose.prod.yml build

prod-up: ## Inicia containers de produção
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Para containers de produção
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Logs de produção
	docker-compose -f docker-compose.prod.yml logs -f

