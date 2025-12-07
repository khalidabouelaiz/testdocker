FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Angular dev server
EXPOSE 4200

CMD ["npm", "start"]
