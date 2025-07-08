# Documentation de l'Architecture - Module Salle

## **Vue d'ensemble**

L'architecture suit un pattern inspiré de **Clean Architecture**, qui permet de bien séparer les responsabilités et rendre l'application maintenable, testable et évolutive.

Chaque couche a une responsabilité unique et clairement définie.

---

## **Schéma des Couches**

```
Client (HTTP Request)
        ↓
 Routes (SalleRoutes)
        ↓
Controller (SalleController)
        ↓
Interactor / Service (SalleInteractor)
        ↓
Repository (SalleRepository)
        ↓
Database (PostgreSQL)

```

---

## **Détail par Couche**

### 1. **Routes : SalleRoutes.ts**

**Rôle** :

Définit les endpoints HTTP et lie les routes aux méthodes du controller.

**Exemple** :

```tsx
this.server.post("/salle", this.controller.createSalle.bind(this.controller));
```

Les routes ne contiennent aucune logique métier. Elles servent uniquement à exposer les points d'entrée de l'API.

---

### 2. **Controller : SalleController.ts**

**Rôle** :

Gère la logique liée aux requêtes HTTP :

- Récupérer et valider les paramètres de la requête
- Gérer les erreurs et les statuts HTTP
- Transférer la logique métier vers l'Interactor

**Exemple simplifié** :

```tsx
const SalleCreateParams = SalleCreateSchema.parse(req.body);
const createdSalle = await this.interactor.createSalle(SalleCreateParams);
return reply.status(201).send(createdSalle);
```

---

### 3. **Interactor (Service Métier) : SalleInteractor.ts**

**Rôle** :

Contient la **logique métier pure**, indépendante de la technologie (Fastify, base de données, etc.).

- Application des règles métier (ici, création d'une salle)
- Communication avec le Repository
- On gère les erreurs métiers (ex: un name doit contenir X caractères)

**Exemple** :

```tsx
const salle = await this.repository.create(CreateSalleCreateParams);
return salle;
```

---

### 4. **Repository : SalleRepository.ts**

**Rôle** :

Accès aux données :

- Exécute les requêtes SQL
- Transforme les résultats pour les renvoyer à l'Interactor

**Exemple** :

```tsx
const query = "INSERT INTO salle (name) VALUES ($1) RETURNING id, name";
const result = await this.client.query(query, values);
return result.rows[0];
```

Le Repository isole complètement l'accès à la base de données du reste de l'application.

---

## **Gestion des Dépendances : Typedi**

L'injection de dépendances via `typedi` permet de :

- Faciliter les tests (mock des dépendances)
- Simplifier la gestion de l'instanciation (Se fait auto)

Exemple d'injection automatique :

```tsx
@Service()
export class SalleController {
  constructor(private interactor: SalleInteractor) {}
}
```

---

## **Résumé**

| Couche     | Rôle principal                      |
| ---------- | ----------------------------------- |
| Routes     | Exposer les endpoints API           |
| Controller | Gérer les requêtes et réponses HTTP |
| Interactor | Logique métier (application)        |
| Repository | Accès aux données (PostgreSQL)      |

---

## **Avantages de cette Architecture**

- Séparation claire des responsabilités
- Testabilité accrue (chaque couche peut être mockée)
- Facilité d'évolution (ajout d'autres cas métiers ou technologies)
- Lisibilité et maintenance améliorées
