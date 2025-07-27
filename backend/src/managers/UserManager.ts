import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
const ADMIN_PASSWORD = "ADMIN_PASSWORD";

export class UserManager {

    // This class manages user interactions with the quiz system.
    // It handles user connections, quiz creation, problem submission, and state management.
    private quizManager;

    /* 
    This constructor initializes the UserManager with a QuizManager instance.
    */
    constructor() {
        this.quizManager = new QuizManager
    }

    addUser(socket: Socket) {
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name)
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
            socket.join(data.roomId);
        });

        socket.on("joinAdmin", (data) => {
            console.log("Admin login attempt with password:", data.password);
            if (data.password !== ADMIN_PASSWORD) {
                console.log("Admin authentication failed");
                socket.emit("adminAuth", { success: false });
                return;
            }
            console.log("Admin authenticated successfully");
            socket.emit("adminAuth", { success: true });

            socket.on("createQuiz", data => {
                try {
                    this.quizManager.addQuiz(data.roomId);
                    socket.emit("quizCreated", { roomId: data.roomId });
                } catch (error) {
                    socket.emit("error", { message: "Failed to create quiz" });
                }
            });

            socket.on("createProblem", data => {
                try {
                    this.quizManager.addProblem(data.roomId, data.problem);
                    socket.emit("problemAdded", { roomId: data.roomId });
                } catch (error) {
                    socket.emit("error", { message: "Failed to add problem" });
                }
            });

            socket.on("next", data => {
                try {
                    this.quizManager.next(data.roomId);
                } catch (error) {
                    socket.emit("error", { message: "Failed to proceed to next question" });
                }
            });

            socket.on("start", data => {
                try {
                    this.quizManager.start(data.roomId);
                } catch (error) {
                    socket.emit("error", { message: "Failed to start quiz" });
                }
            });

            socket.on("getQuizState", data => {
                try {
                    const state = this.quizManager.getCurrentState(data.roomId);
                    socket.emit("quizStateUpdate", state);
                } catch (error) {
                    socket.emit("error", { message: "Failed to get quiz state" });
                }
            });
        });

        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            if (submission != 0 && submission != 1 && submission != 2 && submission != 3) {
                console.error("issue while getting input " + submission)
                return;
            }
            console.log("sub,itting")
            console.log(roomId);
            this.quizManager.submit(userId, roomId, problemId, submission)
        });
    }


}