const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    senderName: {
        type: String
    },
    senderId: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);