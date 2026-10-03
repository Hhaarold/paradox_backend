# ParadoX Backend

API REST del proyecto ParadoX construida con Node.js, Express, MongoDB y Mongoose.

## Requisitos

- Node.js 18+
- MongoDB Atlas o instancia local
- JWT secret configurado en `.env`

## Instalación

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en `.env.example`.
4. Inicia el proyecto:
   ```bash
   npm start
   ```

## Variables de entorno

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
```

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/paradoxes`
- `POST /api/paradoxes`
- `GET /api/users/ranking`
- `GET /api/users/profile`

## Seguridad

- JWT con `JWT_SECRET` obligatorio.
- Contraseñas nunca se devuelven en respuestas.
- Roles permitidos: `user` y `admin`.
- Endpoints administrativos protegidos con `protect` y `authorize('admin')`.
