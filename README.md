# ParadoX Backend

API REST del proyecto **ParadoX**, desarrollada con Node.js, Express y MongoDB.

## Stack

* Node.js
* Express
* MongoDB / Mongoose
* JWT
* bcryptjs
* express-validator
* Swagger

## Configuración

Variables de entorno requeridas:

```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
```

## Ejecución

```bash
npm run dev
```

## Documentación

Swagger UI:

```text
/api-docs
```

## Endpoints

### Autenticación

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Paradojas

```text
GET    /api/paradoxes
GET    /api/paradoxes/:id
POST   /api/paradoxes
PUT    /api/paradoxes/:id
DELETE /api/paradoxes/:id

POST /api/paradoxes/:id/layers
POST /api/paradoxes/:id/layers/:layerIndex/responses
POST /api/paradoxes/:id/responses/:responseId/vote
```

### Usuarios

```text
GET    /api/users/profile
GET    /api/users/ranking
GET    /api/users
DELETE /api/users/:id
PATCH  /api/users/:id/ban
PATCH  /api/users/:id/unban
PATCH  /api/users/:id/role
```

### Duelos

```text
POST  /api/duels
PATCH /api/duels/:id
```

## Roles

* `user`
* `admin`

Las rutas que requieren autenticación utilizan JWT mediante `Authorization: Bearer <token>`.


## Estado

Backend funcional para integración con el frontend de ParadoX.
