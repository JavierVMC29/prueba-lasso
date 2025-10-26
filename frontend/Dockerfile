# Etapa 1: construir la app con pnpm
FROM node:22.18.0-alpine AS build

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# --- ARGs para inyectar variables ---
ARG VITE_API_URL
ARG VITE_APP_URL
ARG VITE_USE_LOCAL_REPOSITORIES=false
ARG VITE_FEATURE_TRAMITES=false
ARG VITE_FEATURE_P2P=false
ARG VITE_FEATURE_GUIA_TRAMITES=false
ARG VITE_FEATURE_SOBRE_NOSOTROS=false
ARG VITE_ENV=production

# Crear el .env.production dinámicamente
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env \
    && echo "VITE_USE_LOCAL_REPOSITORIES=${VITE_USE_LOCAL_REPOSITORIES}" >> .env \
    && echo "VITE_FEATURE_TRAMITES=${VITE_FEATURE_TRAMITES}" >> .env \
    && echo "VITE_FEATURE_P2P=${VITE_FEATURE_P2P}" >> .env \
    && echo "VITE_FEATURE_GUIA_TRAMITES=${VITE_FEATURE_GUIA_TRAMITES}" >> .env \
    && echo "VITE_FEATURE_SOBRE_NOSOTROS=${VITE_FEATURE_SOBRE_NOSOTROS}" >> .env \
    && echo "VITE_APP_URL=${VITE_APP_URL}" >> .env \
    && echo "VITE_ENV=${VITE_ENV}" >> .env

# Build de la app
RUN pnpm run build

# Etapa 2: servir con nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
