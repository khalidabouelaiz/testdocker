# Étape 1 : build Angular (front uniquement)
FROM node:22-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code
COPY . .

# Build du front SANS SSR
RUN npm run build -- --no-ssr --configuration=production

# Étape 2 : Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier le build Angular
COPY --from=builder /app/dist/ai-shop-chat/browser /usr/share/nginx/html

# Exposer le port HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
