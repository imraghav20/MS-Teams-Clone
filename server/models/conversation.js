const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    conversationName: {
        type: String,
        default: "New Conversation"
    },
    messages: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema);