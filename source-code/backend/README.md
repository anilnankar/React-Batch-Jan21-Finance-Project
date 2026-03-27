# Backend Setup (Node.js + Express)

This backend project is created inside `source-code/backend`.

## 1) Create project folder

Backend folder path:

`source-code/backend`

## 2) Initialize Node project

```bash
npm init -y
```

This creates `package.json`.

## 3) Install dependencies

Runtime dependencies:

```bash
npm install express cors dotenv
```

Dev dependency:

```bash
npm install -D nodemon
```

## 4) Configure scripts

Added scripts in `package.json`:

- `npm run dev` -> starts with nodemon for development
- `npm start` -> starts with node for production/basic run

## 5) Create project structure

```text
backend/
  src/
    routes/
      health.routes.js
    app.js
    server.js
  .env.example
  .gitignore
  package.json
```

## 6) Environment variables

Copy `.env.example` to `.env` and update values as needed:

```env
PORT=5000
NODE_ENV=development
```

## 7) Run the backend

Development mode:

```bash
npm run dev
```

Production/basic mode:

```bash
npm start
```

## 8) Test API endpoints

- `GET /` -> Welcome message
- `GET /api/health` -> Health status JSON

Examples:

- [http://localhost:5000/](http://localhost:5000/)
- [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Notes

- `app.js` contains middleware and routes.
- `server.js` handles app startup and port configuration.
- `health.routes.js` is a simple feature route and starter pattern for future modules.
- Keep secrets only in `.env` (already ignored in git).
