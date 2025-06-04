#!/bin/bash

# Beende das Skript bei einem Fehler
set -e

# Funktion zur Anzeige von Statusmeldungen
log() {
  echo -e "\n\033[1;32m$1\033[0m\n"
}

wait_with_progress() {
  local seconds=10  # Anzahl der Sekunden zum Warten

  for ((i=1; i<=seconds; i++)); do
    echo "Wartezeit: $i Sekunde(n)"
    sleep 1
  done
  echo "Wartezeit abgeschlossen!"
}

# 1. Minikube starten
log "[1/10] Starte Minikube..."
minikube start

# 2. Pulle die Docker-Images von Docker Hub
log "[2/10] Pulle Docker-Images von Docker Hub..."
docker pull philthygpt/frontend-react:latest
docker pull philthygpt/frontend-angular:latest
docker pull philthygpt/backend:latest
docker pull postgres:17

# 3. Lade die Docker-Images in Minikube
log "[3/10] Lade Docker-Images in Minikube..."
minikube image load philthygpt/frontend-react:latest
minikube image load philthygpt/frontend-angular:latest
minikube image load philthygpt/backend:latest
minikube image load postgres:17

# 4. Namespace erstellen
log "[4/10] Erstelle Namespace..."
kubectl create namespace shopping-app || echo "Namespace 'shopping-app' existiert bereits."

# 5. PostgreSQL Deployments und Services erstellen
log "[5/10] Deploye PostgreSQL-Datenbanken (db-a und db-b)..."
kubectl apply -f ./k8s/db-a.yaml -n shopping-app
kubectl apply -f ./k8s/db-b.yaml -n shopping-app

# 6. Backends Deployment und Service erstellen
log "[6/10] Deploye Backends (backend-a und backend-b)..."
kubectl apply -f ./k8s/backend-a.yaml -n shopping-app
kubectl apply -f ./k8s/backend-b.yaml -n shopping-app

# 7. Frontends Deployment und Service erstellen
log "[7/10] Deploye Frontends (React und Angular)..."
kubectl apply -f ./k8s/frontend-react.yaml -n shopping-app
kubectl apply -f ./k8s/frontend-angular.yaml -n shopping-app

# 8. Warten, bis alle Pods bereit sind (10 Sekunden)
log "[8/10] Warten bis alle Pods bereit sind..."
wait_with_progress

# 9. Zeige den Status der Ressourcen im Namespace an
log "[9/10] Zeige Status aller Ressourcen im Namespace 'shopping-app'..."
kubectl get all -n shopping-app

# 10. Port-Forwarding für lokale Entwicklung starten
log "[10/10] Starte Port-Forwarding für lokale Entwicklung..."

# Frontends
kubectl port-forward svc/frontend-react -n shopping-app 6000:80 &
kubectl port-forward svc/frontend-angular -n shopping-app 6001:80 &

# Backends
kubectl port-forward svc/backend-a -n shopping-app 5000:8080 &
kubectl port-forward svc/backend-b -n shopping-app 5001:8080 &

echo "✅ Alles weitergeleitet!

# Warte auf alle Hintergrundprozesse, damit sie nicht abbrechen
wait
