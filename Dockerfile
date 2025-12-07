# Étape 1 : build Angular
FROM node:22-alpine AS builder

# Dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Build Angular (sortie dans dist/ai-shop-chat/browser)
RUN npm run build

# Étape 2 : Nginx pour servir les fichiers
FROM nginx:alpine

# Copier le build Angular dans le dossier public de Nginx
COPY --from=builder /app/dist/ai-shop-chat/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
