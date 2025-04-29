"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./managers/IoManager");
const UserManager_1 = require("./managers/UserManager");
const io = IoManager_1.IoManager.getIo();
io.listen(3000);
const userManager = new UserManager_1.UserManager();
io.on('connection', (socket) => {
    console.log('running');
    userManager.addUser(socket);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
