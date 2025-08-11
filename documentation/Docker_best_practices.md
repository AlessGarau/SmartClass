# Docker best practices

# Lower image size

use alpine

```docker
FROM node:22-alpine
```

Alpine est fait exprès pour les containers, donc garde juste l’essentiel **MAIS** peut créer certain pb de compatibilité

# Layer caching

### **Pourquoi ça optimise le caching ?**

1. Les **fichiers `package.json`** sont copiés **avant** le reste du code source.
2. Si le `package.json` ne change pas, l'étape `RUN npm install` utilise le cache, même si le code source change après.
3. Si tu mets `COPY . .` avant, tout changement dans le code source invaliderait le cache de l'installation des dépendances

```docker
FROM node:22-alpine
WORKDIR /app
#Cette étape permet le caching
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run"]
```

## What cause cache invalidation

1. Changer les fichiers copier
2. Changer les instructions dans le `Dockerfile`

# Remove useless files

créer un `.dockerignore`

```yaml
# Empêcher d'envoyer les modules installés (ils seront recréés dans l'image)
node_modules
npm-debug.log

# Ignorer les fichiers de configuration locaux
.env
*.local

# Ignorer Git
.git
.gitignore

# Ignorer les fichiers de build
dist
build

# Ignorer les fichiers systèmes ou d'éditeur
.DS_Store
.idea
.vscode
*.swp

```

# Image Layers

## How do they work ?

1. Chaque couche dans Docker est **immutable** et contient uniquement les modifications par rapport à la couche précédente.
2. Des commandes `RUN` séparées créent de nouvelles couches, en préservant les fichiers des couches précédentes.
3. **Supprimer** des fichiers dans une couche ne les supprime pas des couches précédentes.
4. Les fichiers supprimés sont marqués comme "inaccessibles" mais occupent toujours de l'espace dans l'image.
5. Docker **ne peut pas** supprimer les données d'une couche précédente à cause de l'**immutabilité**.

# Multi-Stage Builds

Le **Multi-Stage Build** est une technique qui permet de construire des images Docker en utilisant **plusieurs étapes intermédiaires**, afin de :

- Séparer les étapes de compilation, de tests et d'exécution.
- Minimiser la taille de l'image finale.
- Garder dans l'image finale uniquement ce qui est **strictement nécessaire** au runtime

| **Avantage**             | **Explication**                                                                 |
| ------------------------ | ------------------------------------------------------------------------------- |
| Image finale plus légère | Tu n'y mets que les fichiers utiles à l'exécution.                              |
| Sécurité renforcée       | Aucun outil de build, dépendances dev, ou code source brut dans l'image finale. |
| Caching optimisé         | Tu peux exploiter le cache Docker pour accélérer les builds.                    |
| Maintenabilité améliorée | Tout est dans un seul Dockerfile, plus simple à gérer.                          |

## **Exemple simple**

```docker
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY -from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Exemple avec NPM + Explication

```docker
# Étape de base
FROM node:22-alpine AS base

# Étape des dépendances de production
FROM base AS deps
WORKDIR /app
# Copie uniquement les fichiers nécessaires aux dépendances
COPY package.json package-lock.json ./
# Utilisation du cache de npm
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --omit=dev

# Étape de build
FROM base AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci
# Copie du code source
COPY . .
# Build du projet
RUN npm run build

# Étape finale super légère pour exécution
FROM base
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
CMD ["node", "./dist/index.js"]

```

- `npm ci --omit=dev` : installe uniquement les dépendances de prod dans l'étape `deps`.
- Utilisation de `-mount=type=cache` pour **cacher le dossier `.npm`**, améliore le temps de build en réutilisant le cache entre builds.
- Le code source n'est copié **qu'après** l'installation des dépendances pour optimiser le caching.
- La dernière image est légère : seules les dépendances de production et le dossier `dist` sont présents. On les récupères via `--from=<nom_etape> <path_source> <path_destination>`

### 1. **Qu'est-ce que `npm ci` ?**

`npm ci` signifie **Clean Install**, c'est une commande conçue pour les environnements automatisés, notamment les **builds Docker, CI/CD, déploiements**, etc.

Différences principales avec `npm install` :

| Aspect                                     | `npm ci` | `npm install`                     |
| ------------------------------------------ | -------- | --------------------------------- |
| Utilise strictement le `package-lock.json` | Oui      | Peut modifier `package-lock.json` |
| Supprime `node_modules` avant installation | Oui      | Non, il ajoute/merge              |
| Plus rapide et reproductible               | Oui      | Moins fiable en build automatique |

Donc, dans un contexte **Docker**, `npm ci` garantit que les dépendances sont **100% identiques** à celles définies dans `package-lock.json`

`--omit=dev` évite d’installer les **devDependencies** comme _eslint_ ou _nodemon_

## Docker-compose de production
