const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const conversationRoute = require('./routes/conversation');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to Mongo DB.");
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.use('/api/users', userRoute);

app.use('/api/auth', authRoute);

app.use('/api/conversations', conversationRoute);

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded.");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        const signal = data.signal;
        const hostName = data.from;
        io.to(data.to).emit("callAccepted", { signal, name: hostName, from: data.to });
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});