const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    sender: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);