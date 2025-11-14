const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const main = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authentication");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problems");
const profileRouter = require("./routes/profile");
const submissionRouter = require("./routes/submissions");
const solutionVideoRouter = require('./routes/solutionVideo');
const adminRouter = require('./routes/admin');
const aiRouter = require("./routes/ai");
const cors = require("cors");
const ACTIONS = require("./utils/realtimeActions");


app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/authentication", authRouter);
app.use("/profile", profileRouter);
app.use("/problems", problemRouter);
app.use("/submissions", submissionRouter);
app.use("/ai", aiRouter);
app.use("/solution-video", solutionVideoRouter);
app.use("/admin", adminRouter);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO server with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket logic
const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
    });
});

const InitializeConnections = async () => {
    // connecting with database and redis
    await Promise.all([main(), redisClient.connect()]);

    // starting server
    server.listen(process.env.PORT, async () => {
        console.log("CodeForge server started with Socket.IO support");
    })
}

InitializeConnections()

