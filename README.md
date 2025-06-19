# Auth Project (React + Node.js/Express + MySQL + Prisma)

## Project Structure

```
auth/
├── docker-compose.yml   # Docker for MySQL
├── README.md            # This file
├── client/              # React frontend
└── server/              # Node.js/Express backend
```

## Step-by-Step Setup

### 1. Start MySQL with Docker

- In the `auth` folder, run:
  ```bash
  docker-compose up -d
  ```
- MySQL will be available at `localhost:3306` (user: `user`, password: `password`, db: `authdb`).

### 2. Backend Setup

- Go to `server/` and run:
  ```bash
  npm install
  npx prisma migrate dev --name init
  ```
- Make sure `.env` in `server/` has:
  ```
  DATABASE_URL="mysql://user:password@localhost:3306/authdb"
  ```

### 3. Frontend Setup

- Go to `client/` and run:
  ```bash
  npm install
  npm start
  ```

### 4. Development

- Backend: `npm start` in `server/`
- Frontend: `npm start` in `client/`

---

## Why this structure?

- Keeps auth project self-contained and portable.
- Docker ensures consistent DB for all devs.
- Prisma makes DB access and migrations easy.
- React/Express separation is modern best practice.


