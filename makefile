.PHONY: install start migrate stop restart clean build logs

ENV ?= dev
COMPOSE_FILE = Docker/docker-compose.$(ENV).yml
PROJECT_NAME = smart-class-$(ENV)

clean:
	@echo "Nettoyage complet..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v --remove-orphans
	@echo "Nettoyage terminé"

install:
	@echo "Installation des dépendances Node.js..."
	cd packages/server && npm install
	cd packages/client && npm install
	@echo "Installation des dépendances Docker..."
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build --no-cache
	@echo "Installation terminée"

start:
	@echo "Démarrage des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up
	@echo "Services démarrés"
	@echo "Statut des conteneurs:"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

restart:
	@echo "Redémarrage des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart
	@echo "Services redémarrés"

seed: 
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec smart-class-server-dev npm run db:seed

stop:
	@echo "Arrêt des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down
	@echo "Services arrêtés"

migrate:
	@echo "Génération des fichiers de migrations..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec smart-class-server-dev npm run db:generate
	@echo "Lancement des migrations dans le conteneur..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec smart-class-server-dev npm run db:migrate

build: clean install start

status:
	@echo "Statut des conteneurs:"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

logs:
	@echo "Affichage des logs..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

help:
	@echo "Commandes disponibles:"
	@echo "  make clean    - Nettoyage complet des conteneurs et volumes"
	@echo "  make install  - Installation des dépendances"
	@echo "  make start    - Démarrage des services"
	@echo "  make restart  - Redémarrage des services"
	@echo "  make stop     - Arrêt des services"
	@echo "  make migrate  - Génération et exécution des migrations"
	@echo "  make build    - clean, install et start"
	@echo "  make status   - Statut des conteneurs"
	@echo "  make logs     - Affichage des logs"
	@echo "  make help     - Afficher cette aide"
