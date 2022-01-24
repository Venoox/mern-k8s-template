# mern-k8s-template

This template consists of

- React frontend
- NodeJS with Express REST backend
- MySQL database

## How to run

Domain name is in `ingress.yml` set to `k8s.tomazcuk.me` which is my domain. To make it work on your environment you need to either add `k8s.tomazcuk.me` to your /etc/hosts file pointing to cluster ip or change the domain to yours.

You need to ensure folder at /sql with init.sql inside is available in your host.

How to run in minikube:

```
minikube start
minikube mount /path/to/sql:/sql
kubectl apply -f db-config.yml mysql-pv.yml ingress.yml db.yml api.yml app.yml
```

Or with skaffold:

```
skaffold dev
```

## Technical

Frontend, backend and db are deployed with Deployment.
Frontend and backend have set 3 replicas with rolling deployment.
Database has 1 replica with recreate strategy, hostPath volume for sql init and persistent volume for data.

Backend and database share ConfigMap which has information about database user, password, database name...
Persisent volume is hostPath with 2Gi and mysql persistent volume claim for 1Gi.

Images are built on Github using CI/CD and pushed to Github's registry.
Frontend has readiness probe as http get request for index.html.
Backend has liveness probe as http get to /live which just returns a string which indicates it's alive and readiness probe which checks connection to database.

All 3 deployments have their corresponding ClusterIP services.
Ingress has path based routing. `/` for frontend and `/api` for backend.
