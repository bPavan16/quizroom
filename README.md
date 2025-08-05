# QuizRoom – Real-Time Quiz App

QuizRoom is a modern, real-time quiz application built with a TypeScript/Node.js backend and a beautiful React + Tailwind CSS frontend using shadcn/ui components. It allows users to join quiz rooms, answer questions live, and see real-time leaderboards. Admins can create and control quizzes with ease.

## ✨ Features

- Real-time quiz rooms with Socket.IO
- Beautiful, responsive UI with shadcn/ui and Tailwind CSS
- Live question display with timer and progress bar
- Multiple choice questions (A/B/C/D)
- Real-time answer submission and leaderboard updates
- Admin panel for quiz creation, question management, and flow control
- Connection status indicators for reliability

## Check out some demo images of QuizRoom in action:

<div align="center">
  <img src="images/image1.png" alt="QuizRoom Home Screen" style="width:80%;" />
  <br/>
  <em>Home screen for Participants joining a quiz.</em>
  <br><br>
  <img src="images/image2.png" alt="Admin Login" style="width:80%;" />
  <br/>
  <em>Admin login screen for secure access to the admin panel.</em>
  <br><br>
  <img src="images/image3.png" alt="Quiz Room Management" style="width:80%;" />
  <br/>
  <em>Interface for creating and managing quiz rooms.</em>
  <br><br>
  <img src="images/image4.png" alt="Question Management" style="width:80%;" />
  <br/>
  <em>Admin panel for adding and editing quiz questions.</em>
  <br><br>
  <img src="images/image5.png" alt="Leaderboard" style="width:80%;" />
  <br/>
  <em>Quiz Control Panel for managing the quiz flow by the admin.</em>
  <br><br>
  <img src="images/image6.png" alt="Live Question Display" style="width:80%;" />
  <br/>
  <em>Live question display with timer and progress bar.</em>
  <br><br>
  <img src="images/image7.png" alt="Connection Status" style="width:80%;" />
  <br/>
  <em>Real-time leaderboard showing participant scores and rankings (User).</em>
  <br/><br/>
  <img src="images/image8.png" alt="Connection Status" style="width:80%;" />
  <br/>
  <em>Real-time leaderboard showing participant scores and rankings (Admin).</em>
</div>

## 🚀 Quick Start

### 1. Clone the Repository

```sh
git clone https://github.com/bPavan16/quizroom.git
cd quizroom
```

### 2. Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd ../frontend
npm install
```

### 3. Start the Servers

#### Backend

```sh
cd backend
npx tsc
node dist/index.js
```

#### Frontend

```sh
cd frontend
npm run dev
```

### 4. Open the App

Go to [http://localhost:5173](http://localhost:5173) in your browser.

## 🧑‍🎓 User Guide

### For Participants

1. Open the app and enter your name and the room ID to join a quiz.
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

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, Socket.IO
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Real-time:** Socket.IO


## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License - MIT License

---

<div align="center">
Made with ❤️ by Pavan Bhakta
</div>
