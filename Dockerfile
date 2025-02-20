# Etapa de construcción
FROM node:latest AS build-step

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Construye la aplicación Next.js para producción
RUN npm run build

# Etapa de producción
FROM node:alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

WORKDIR /app

# Copia solo los archivos necesarios desde la etapa de construcción
COPY --from=build-step /app/.next /app/.next
COPY --from=build-step /app/public /app/public
COPY --from=build-step /app/package*.json /app/

# Instala las dependencias de producción
RUN npm install --production

# Expone el puerto 3000 para el servidor de Next.js
EXPOSE 3000

# Comando para ejecutar Next.js en producción
CMD ["npm", "start"]
