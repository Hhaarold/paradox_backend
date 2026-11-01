

# ParadoX Backend

API REST encargada de gestionar los usuarios, paradojas, respuestas, votaciones y duelos de la aplicación ParadoX.

## Tecnologías
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Funcionalidades
- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Gestión de usuarios y roles.
- CRUD de paradojas.
- Gestión de respuestas y votaciones.
- Gestión de duelos.
- Conexión con MongoDB.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Hhaarold/paradox_backend.git
cd paradox_backend
npm install
```

Crear un archivo `.env`:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

Ejecutar:

```bash
npm run dev
```

## Documentación

Con el servidor iniciado, consultar:

```text
http://localhost:3000/api-docs
```

## Frontend

**Repositorio:** https://github.com/Hhaarold/paradox

