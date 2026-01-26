# Étape 1 : build Angular
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Étape 2 : servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/lab-platform-frontend /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
