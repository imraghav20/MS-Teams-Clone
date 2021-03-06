const Message = require('../models/message');
const Conversation = require('../models/conversation');
const User = require('../models/user');
const router = require('express').Router();
const auth = require('../middleware/auth');

// new message
router.post('/', auth, async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "You are not authenticated." })
    }

    try {
        const convoId = req.body.convoId;
        const conversation = await Conversation.findById(convoId);  // find conversation to which message belongs

        const user = await User.findById(req.userId);
        const senderName = user.name;  // get senderName

        const newMessage = Message({
            text: req.body.message,
            senderName: senderName,
            senderId: req.userId
        });  // create new message

        const savedMessage = await newMessage.save();  // save new message
        const msgId = savedMessage._id;

        conversation.messages.push(msgId);  // push new message id to conversation
        const result = await conversation.save();

        res.status(200).json(savedMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = router;