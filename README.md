# TUVCB Service Users

Ce micro‑service NestJS centralise la gestion des utilisateurs, des étudiants et des promotions au sein de la plateforme **TUVCB**. Il offre des API CRUD, des métriques et un mécanisme de filtrage pour permettre aux autres services de récupérer des informations sur les comptes et les étudiants. Le service est basé sur **TypeORM** avec une base PostgreSQL et expose sa documentation Swagger à `/api/docs`.

## Fonctionnement général

Le service maintient trois types d’entités :

- **User** : représente un compte utilisateur possédant un rôle (`ADMIN`, `REGISTRAR`, `STUDENT`, etc.). Les utilisateurs sont créés par l’authentification via le service Auth ou manuellement via l’API. Chaque utilisateur possède un portefeuille Ethereum unique pour s’identifier au sein de la chaîne de blocs.
- **Student** : représente un étudiant affilié à une promotion. Le service permet de créer, modifier ou supprimer des étudiants et de les filtrer par promotion. Un étudiant peut être lié à un utilisateur (par exemple un compte étudiant), mais l’entité `Student` stocke également des informations académiques comme le matricule.
- **Promotion** : décrit une cohorte ou année universitaire. Les promotions peuvent être créées, listées ou modifiées. Des API permettent aussi de mettre à jour en masse les promotions des étudiants.

Le service expose un ensemble de routes dans ses contrôleurs `UsersController` et `StudentsController` pour gérer ces entités. Les principaux endpoints sont listés ci‑dessous.

## Installation et configuration

1. **Prérequis** : Node 14 ou plus, pnpm/npm, et une base PostgreSQL. Les variables `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` et `DB_DATABASE` doivent correspondre à votre base.
2. **Clonage** : `git clone https://github.com/tek-up-vcb/tuvcb-service-users.git`
3. **Variables d’environnement** : copiez `.env.example` en `.env` puis ajustez :

   | Variable                                                          | Description                                                                      |
   | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
   | `PORT`                                                            | Port HTTP du service (défaut : 3002).                                            |
   | `NODE_ENV`                                                        | `development` ou `production`.                                                   |
   | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | Paramètres de connexion à PostgreSQL.                                            |
   | `JWT_SECRET`                                                      | Clé utilisée pour signer/valider les tokens JWT (partagée avec le service Auth). |
   | `JWT_EXPIRES_IN`                                                  | Durée des tokens JWT.                                                            |

4. **Installation des dépendances :** `pnpm install` ou `npm install`.
5. **Migrations** : en mode développement, TypeORM peut synchroniser automatiquement la base si `synchronize` est activé dans `AppModule`. En production, exécutez vos migrations manuellement.
6. **Lancement** : `npm run start:dev` pour le mode développement.

Dans l’environnement orchestré, ces variables sont définies dans `docker-compose.yml` et Traefik exposera l’API via `http://app.localhost/api/users` et `http://app.localhost/api/students`.

## API Users

Les endpoints du contrôleur `UsersController` gèrent les opérations sur les comptes utilisateurs :

| Méthode & route                  | Description                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| **POST** `/users`                | Créer un nouvel utilisateur avec son rôle, son adresse wallet, son nom et ses métadonnées. |
| **GET** `/users`                 | Récupérer la liste des utilisateurs (avec pagination et filtre sur les rôles).             |
| **GET** `/users/count`           | Compter le nombre total d’utilisateurs présents.                                           |
| **GET** `/users/wallet/:address` | Rechercher un utilisateur à partir de son adresse Ethereum.                                |
| **GET** `/users/:id`             | Obtenir le détail d’un utilisateur par identifiant.                                        |
| **PATCH** `/users/:id`           | Mettre à jour partiellement un utilisateur (nom, rôle, wallet, etc.).                      |
| **DELETE** `/users/:id`          | Supprimer un utilisateur existant.                                                         |
| **GET** `/users/kpi/metrics/all` | Renvoie des métriques agrégées sur les rôles (nombre d’admins, d’inscrits, etc.).          |

## API Students

Le contrôleur `StudentsController` expose des routes pour gérer les étudiants et les promotions :

| Méthode & route                            | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| **POST** `/students`                       | Créer un étudiant (nom, email, matricule, promotion).               |
| **GET** `/students`                        | Lister les étudiants avec option de filtre `promotionId`.           |
| **GET** `/students/count`                  | Renvoie le nombre total d’étudiants.                                |
| **GET** `/students/kpi/metrics/all`        | Renvoie des métriques globales (nombre par promotion).              |
| **GET** `/students/student/:studentId`     | Rechercher un étudiant par son matricule officiel.                  |
| **GET** `/students/email/:email`           | Rechercher un étudiant par son adresse e‑mail.                      |
| **GET** `/students/:id`                    | Obtenir le détail d’un étudiant par identifiant.                    |
| **PATCH** `/students/:id`                  | Modifier un étudiant (ex. changer de promotion, corriger l’e‑mail). |
| **DELETE** `/students/:id`                 | Supprimer un étudiant.                                              |
| **PUT** `/students/promotions/bulk-update` | Mettre à jour en masse la promotion d’une liste d’étudiants.        |

## API Promotions

Le module `promotions` permet la création et la gestion des promotions mais ses routes sont similaires à celles ci‑dessus : `POST /promotions` pour créer une promotion, `GET /promotions` pour la liste, `PATCH /promotions/:id` pour la mise à jour et `DELETE /promotions/:id` pour la suppression.

## Conseils et bonnes pratiques

- **Authentification** : toutes les routes sont protégées par un guard JWT; utilisez le token émis par le service Auth dans l’en‑tête `Authorization: Bearer <token>`.
- **Pagination et filtres** : utilisez les paramètres de requête (`page`, `limit`, `role`, `promotionId`) pour paginer et filtrer les résultats.
- **Consistance de la base** : lorsqu’un étudiant est créé, assurez‑vous que la promotion référencée existe. Le service renverra une erreur 404 si la promotion n’est pas trouvée.
- **Swagger** : explorez `/api/docs` pour tester les routes et consulter les schémas de requêtes et de réponses.
