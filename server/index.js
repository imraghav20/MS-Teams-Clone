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
const messageRoute = require('./routes/message');

dotenv.config();

// connecting database to server
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to Mongo DB.");
});

// initialise socket io
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// use dependencies
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const PORT = process.env.PORT || 5000;


// app routes
app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);


// socket io communication actions
const rooms = {};
const userRoomPairs = {};
io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    // check number of users already in room before user asks to join
    socket.on("user-wants-to-join", (roomId) => {
        if(rooms[roomId]){
            socket.emit("join-response", rooms[roomId].length);
        }
        else{
            socket.emit("join-response", 0);
        }
    });

    // add user socket id to corresponding room
    socket.on("user-joined", ({roomId, userId}) => {
        userRoomPairs[userId] = roomId;
        if(rooms[roomId]){
            rooms[roomId].push(userId);
        }
        else{
            rooms[roomId] = [userId];
        }
    });

    // send other user id to the joining user in order to call the 1st user
    socket.on("other-user-id", (roomId) => {
        const otherUser = rooms[roomId][0];
        socket.emit("other-user", otherUser);
    })

    // when user disconnects from web socket
    socket.on("disconnect", () => {
        const room = userRoomPairs[socket.id]
        if(rooms[room]){
            const index = rooms[room].indexOf(socket.id);
            if(index !== -1){
                rooms[room].splice(index, 1);
            }
            delete userRoomPairs[socket.id];
        }

        if(rooms[room]){
            io.to(rooms[room][0]).emit("callEnded");
        }
    });

    // when user calls another user
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    // when 1st user answers the call
    socket.on("answerCall", (data) => {
        const signal = data.signal;
        const hostName = data.from;
        io.to(data.to).emit("callAccepted", { signal, name: hostName, from: data.to });
    });
})


// server listening
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});