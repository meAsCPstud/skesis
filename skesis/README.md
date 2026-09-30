# Skesis - Plataforma de seguimiento de hábitos saludables

Plataforma web para que estudiantes técnicos registren hábitos (sueño, ejercicio, hidratación,
alimentación y descanso mental), visualicen su progreso, reciban recomendaciones y consulten a un asistente virtual.

**Stack:** React + Vite (frontend), Node.js + Express (backend), MongoDB opcional (por defecto guarda en un archivo JSON local).

## Cómo ejecutar

Requiere Node.js 18 o superior. Abre dos terminales.

```bash
# Terminal 1 - backend (http://localhost:4000)
cd backend
npm install
npm run dev

# Terminal 2 - frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

## MongoDB (opcional)

En `backend/.env` define `MONGODB_URI` (por ejemplo `mongodb://127.0.0.1:27017/skesis` o una URI de MongoDB Atlas).
Si queda vacío, los datos se guardan en `backend/data/habits.json`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/health | Estado del servidor |
| GET | /api/categories | Categorías y metas diarias |
| GET / POST | /api/habits | Listar / registrar hábitos |
| DELETE | /api/habits/:id | Eliminar un registro |
| GET | /api/progress?days=7 | Progreso, promedios y racha |
| GET | /api/recommendations | Recomendaciones personalizadas |
| POST | /api/assistant | Asistente virtual `{ "message": "..." }` |
