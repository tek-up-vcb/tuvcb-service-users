# TUVCB Users Service

Service de gestion des utilisateurs pour la plateforme TUVCB.

## Description

Ce service NestJS gère les opérations CRUD pour les utilisateurs de la plateforme. Il utilise PostgreSQL comme base de données et TypeORM pour l'accès aux données.

## Fonctionnalités

- Création, lecture, mise à jour et suppression d'utilisateurs
- Validation des adresses Ethereum
- Gestion des rôles (Admin, Teacher, Guest)
- API REST avec documentation Swagger
- Validation des données avec class-validator

## Technologies

- NestJS
- TypeORM
- PostgreSQL
- Swagger/OpenAPI
- Docker

## Installation

```bash
npm install
```

## Développement

```bash
npm run start:dev
```

## Production

```bash
npm run build
npm run start:prod
```

## API Documentation

Une fois le service démarré, la documentation Swagger est disponible à l'adresse :
`http://localhost:3002/api/docs`

## Variables d'environnement

- `PORT` - Port du service (défaut: 3002)
- `DB_HOST` - Hôte de la base de données
- `DB_PORT` - Port de la base de données (défaut: 5432)
- `DB_USERNAME` - Nom d'utilisateur de la base de données
- `DB_PASSWORD` - Mot de passe de la base de données
- `DB_DATABASE` - Nom de la base de données
- `NODE_ENV` - Environnement (development/production)
