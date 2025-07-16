# QuizRoom Backend

This is the backend server for **QuizRoom**, a real-time quiz application. It is built with Node.js, TypeScript, and Socket.IO, and is responsible for managing quiz rooms, users, questions, and real-time communication with the frontend.

## 🚀 Features

- Real-time quiz room management with Socket.IO
- User and admin roles
- Live question broadcasting and answer collection
- Real-time leaderboard calculation
- TypeScript for type safety and maintainability

## 🛠️ Tech Stack

- **Node.js**
- **TypeScript**
- **Socket.IO**

## 📁 Project Structure

```
backend/
  src/
    managers/      # Quiz, user, and IO managers
    types/         # Shared TypeScript types
    Quiz.ts        # Quiz logic
    index.ts       # Entry point
  package.json
  tsconfig.json
  ...
```

## ⚡ Socket.IO Events

### User Events

- `join` — Join a quiz room as a participant
  - Payload: `{ roomId, name }`
  - Response: `init` with `{ userId, state }`
- `submit` — Submit an answer to a question
  - Payload: `{ roomId, problemId, userId, submission }`

### Admin Events

- `joinAdmin` — Authenticate as admin
  - Payload: `{ password }` (default: `ADMIN_PASSWORD`)
- `createQuiz` — Create a new quiz room
  - Payload: `{ roomId }`
- `createProblem` — Add a question to a quiz
  - Payload: `{ roomId, problem }`
- `next` — Move to the next question or leaderboard
  - Payload: `{ roomId }`

### Server Events

- `init` — Initial state after joining
- `problem` — New question broadcast
- `leaderboard` — Leaderboard update

## 📦 Setup & Usage

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Build the project:**
   ```sh
   npx tsc
   ```
3. **Start the server:**
   ```sh
   node dist/index.js
   ```
   The server will start on port `3000` by default.
