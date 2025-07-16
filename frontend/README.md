# QuizRoom Frontend

This is the frontend for **QuizRoom**, a real-time quiz application. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui, it provides a beautiful and responsive interface for both quiz participants and admins.

## ✨ Features

- Join or create quiz rooms in real time
- Live question display with timer and progress bar
- Multiple choice answer selection
- Real-time leaderboard updates
- Admin panel for quiz and question management
- Modern, responsive UI with shadcn/ui and Tailwind CSS
- Connection status indicators

## 🛠️ Tech Stack

- **React** (with TypeScript)
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Socket.IO Client**

## 📁 Project Structure

```
frontend/
  src/
    components/    # UI and page components
    contexts/      # React context for socket
    types/         # Shared TypeScript types
    lib/           # Utility functions
    ...
  public/
  package.json
  tailwind.config.js
  vite.config.ts
  ...
```

## 🧑‍🎓 User Guide

### For Participants

1. Enter your name and the room ID to join a quiz.
2. Wait for the admin to start the quiz.
3. Answer questions as they appear. Each question has a timer and progress bar.
4. See your score and ranking on the real-time leaderboard.

### For Admins

1. Click "Admin Mode" in the top-right corner.
2. Login with the password: `ADMIN_PASSWORD`
3. Create a quiz room (e.g., "room123").
4. Add questions with multiple choice options and select the correct answer.
5. Start the quiz and control the flow (next question, end quiz, etc.).
6. Watch the leaderboard update in real time.

## 🚀 Setup & Usage

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📝 License
MIT
