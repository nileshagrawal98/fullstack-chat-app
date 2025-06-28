import { Server } from "socket.io";
import http from "http";
import express from "express"
import { getUserFromToken } from "./utils.js";
import cookie from 'cookie';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true,
    },
});

// Used for storing current online users
const userSocketMap = {}; // { userId (from db): socketId }

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
};

io.use(async (socket, next) => {
    const cookies = socket.handshake.headers.cookie || '';
    if (!cookies) return next(new Error("Unauthorized: No token present"));

    const token = cookie.parse(cookies)?.jwt;
    if (!token) return next(new Error("Unauthorized: No token present"));

    const user = await getUserFromToken(token);
    if (!user) return next(new Error('Unauthorized: Invalid token'));

    socket.user = user;
    next();
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.user?._id;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export { io, app, server };
