# === 1. Build-Phase ===
FROM node:20-alpine AS builder

WORKDIR /app

# Pakete installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren und App bauen
COPY . .
RUN npm run build

# === 2. Serve-Phase (statischer Webserver) ===
FROM nginx:alpine

# Build-Output kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Laufzeit-Config-Datei manuell platzieren
COPY public/config.json /usr/share/nginx/html/config.json

# Port öffnen
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
