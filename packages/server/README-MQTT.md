# Service de Collecte de Données MQTT

Ce service collecte automatiquement les données des capteurs via MQTT et les stocke dans la base de données toutes les 30 secondes.

## Configuration des Capteurs

Le service est configuré pour écouter les topics suivants :

### Capteurs configurés
- **Mouvement** : `pws-packet/202481598920718/641896457/127`
- **Humidité** : `pws-packet/202481598920718/641896457/114`
- **Pression** : `pws-packet/202481598920718/641896457/116`
- **Température** : `pws-packet/202481598920718/641896457/112`

### Informations des capteurs
- **Sensor ID** : `c4ff9159-eced-4bd9-9f71-527b3bd44fa9`
- **Room ID** : `c5a3a18c-69ac-4c24-b170-a47613d51435`

## Configuration

### Variables d'environnement

Ajoutez cette variable dans votre fichier `.env` ou `docker-compose.yml` :

```bash
MQTT_BROKER_URL=mqtt://localhost:1883
```

### Configuration Docker

Le service est automatiquement configuré dans `docker-compose.dev.yml` :

```yaml
environment:
  - MQTT_BROKER_URL=mqtt://localhost:1883
```

## Fonctionnement

1. **Connexion MQTT** : Le service se connecte au broker MQTT au démarrage
2. **Abonnement** : S'abonne automatiquement aux 4 topics configurés
3. **Collecte** : Écoute en continu les messages MQTT
4. **Sauvegarde** : Toutes les 30 secondes, sauvegarde les dernières données reçues
5. **Logs** : Affiche les informations de connexion et les données reçues

## Logs

Le service affiche différents types de messages :

- `🔗 Service de collecte de données MQTT connecté` : Connexion réussie
- `✅ Abonné au topic ...` : Abonnement aux topics
- `📡 Données reçues sur ...` : Reception de données
- `⏰ Collection périodique démarrée` : Démarrage de la collecte
- `💾 X données sauvegardées` : Sauvegarde réussie
- `❌ Erreur lors de ...` : Erreurs

## Structure des Données

Les données sont stockées dans les tables suivantes :

### Table `temperature`
- `id` : UUID (auto-généré)
- `room_id` : UUID de la salle
- `sensor_id` : UUID du capteur
- `data` : Données brutes du capteur
- `saved_at` : Timestamp de sauvegarde

### Table `humidity`
- `id` : UUID (auto-généré)
- `room_id` : UUID de la salle
- `sensor_id` : UUID du capteur
- `data` : Données brutes du capteur
- `saved_at` : Timestamp de sauvegarde

### Table `pressure`
- `id` : BigInt (timestamp + compteur)
- `room_id` : UUID de la salle
- `sensor_id` : UUID du capteur
- `data` : Données brutes du capteur
- `saved_at` : Timestamp de sauvegarde

### Table `movement`
- `id` : BigInt (timestamp + compteur)
- `room_id` : UUID de la salle
- `sensor_id` : UUID du capteur
- `data` : Données brutes du capteur
- `saved_at` : Timestamp de sauvegarde

## Gestion des Erreurs

- **Erreur de connexion MQTT** : Le serveur continue de fonctionner sans le service MQTT
- **Erreur d'insertion** : Les erreurs sont loggées mais n'interrompent pas le service
- **Arrêt propre** : Le service s'arrête proprement avec `SIGINT` (Ctrl+C)

## Architecture

Le service utilise l'architecture existante avec :

- **TypeDI** : Injection de dépendances
- **Drizzle ORM** : ORM pour la base de données
- **MQTT.js** : Client MQTT
- **Service séparé** : Fonctionne en arrière-plan sans impact sur l'API

## Fichiers créés

- `packages/server/src/services/SensorDataRepository.ts` : Repository pour la base de données
- `packages/server/src/services/SensorDataCollector.ts` : Service de collecte MQTT
- Modification de `packages/server/src/server.ts` : Intégration du service

## Démarrage

Le service démarre automatiquement avec le serveur :

```bash
npm run dev
# ou
make start
```

## Personnalisation

Pour modifier les capteurs ou topics, éditez la configuration dans `SensorDataCollector.ts` :

```typescript
this.sensorConfigs = [
  {
    topic: "votre-topic",
    sensorId: "votre-sensor-id",
    roomId: "votre-room-id",
    type: "temperature" // ou "humidity", "pressure", "movement"
  }
];
``` 