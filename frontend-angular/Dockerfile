# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Serve Stage
FROM nginx:alpine

# Entferne default nginx site config
RUN rm -rf /usr/share/nginx/html/*

# Kopiere Build-Ergebnis
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html

# Optional: Kopiere eine eigene nginx.conf falls nötig
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
