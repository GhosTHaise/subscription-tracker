# Étape 1 : Utiliser une image légère
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances en premier (optimisation du cache)
COPY package*.json ./

# Installer les dépendances en mode production
RUN npm ci --only=production

# Copier le reste des fichiers de l'application
COPY . .

# Étape 2 : Créer une image finale plus légère
FROM node:18-alpine

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'image "builder"
COPY --from=builder /app /app

# Utiliser un utilisateur non root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exposer le port (ex: 3000)
EXPOSE 3000

# Lancer l’application
CMD ["node", "server.js"]
