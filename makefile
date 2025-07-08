.PHONY: install start stop restart clean logs

COMPOSE_FILE = Docker/docker-compose.dev.yml
PROJECT_NAME = smart-class

install:
	@echo "Installation des dépendances..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build
	@echo "Installation terminée"

start:
	@echo "Démarrage des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up
	@echo "Services démarrés"
	@echo "Statut des conteneurs:"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

stop:
	@echo "Arrêt des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down
	@echo "Services arrêtés"

restart:
	@echo "Redémarrage des services..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart
	@echo "Services redémarrés"

clean:
	@echo "Nettoyage complet..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v --remove-orphans
	@echo "Nettoyage terminé"

logs:
	@echo "Affichage des logs..."
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

status:
	@echo "Statut des conteneurs:"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

help:
	@echo "Commandes disponibles:"
	@echo "  make install  - Installation des dépendances"
	@echo "  make start    - Démarrage des services"
	@echo "  make stop     - Arrêt des services"
	@echo "  make restart  - Redémarrage des services"
	@echo "  make clean    - Nettoyage complet"
	@echo "  make logs     - Affichage des logs"
	@echo "  make status   - Statut des conteneurs"
	@echo "  make help     - Afficher cette aide"
