# Etapa 1: compilar la app
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL=http://localhost:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

# Etapa 2: servirla con nginx (las rutas de la SPA vuelven a index.html)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
