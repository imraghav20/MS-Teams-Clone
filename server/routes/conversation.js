const Conversation = require('../models/conversation');
const User = require('../models/user');
const Message = require('../models/message');
const router = require('express').Router();
const auth = require('../middleware/auth');

// get all conversations 
router.get('/', auth, async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "You are not authenticated." })
    }

    try {
        const user = await User.findById(req.userId);
        const chatRooms = user.chatRooms;
        const allUserConvos = [];
        var i = 0;
        chatRooms.map(async (convoId) => {
            const conversation = await Conversation.findById(convoId);
            allUserConvos.push(conversation);
            i += 1;

            if (i === chatRooms.length) {
                allUserConvos.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
                res.status(200).json(allUserConvos);
            }
        });

        if (chatRooms.length === 0) {
            res.status(200).json(allUserConvos);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

// new conversation
router.post('/', auth, async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "You are not authenticated." })
    }

    const newConservation = Conversation({
        conversationName: req.body.conversationName === "" ? "New Meeting" : req.body.conversationName
    });

    try {
        const savedConversation = await newConservation.save();
        const convoId = savedConversation._id;
        const user = await User.findById(req.userId);
        user.chatRooms.push(convoId);
        const result = await user.save();

        res.status(200).json(savedConversation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

// get a conversation
router.get('/:chatId', auth, async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "You are not authenticated." })
    }

    try {
        const convo = await Conversation.findById(req.params.chatId);
        const msgIds = convo.messages;
        const messages = [];
        var i = 0;
        msgIds.map(async (id) => {
            const message = await Message.findById(id);
            messages.push(message);
            i += 1;

            if (i === msgIds.length) {
                messages.sort((a, b) => {
                    return a.createdAt - b.createdAt;
                });
                res.status(200).json({ conversation: convo, messages });
            }
        });

        if (msgIds.length === 0) {
            res.status(200).json({ conversation: convo, messages });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = router;