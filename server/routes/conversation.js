const Conversation = require('../models/conversation');
const User = require('../models/user');
const router = require('express').Router();
const auth = require('../middleware/auth');

// get all conversations 
router.get('/', auth, async (req, res) => {
    if(!req.userId){
        return res.json({message: "You are not authenticated."})
    }

    try {
        const user = await User.findById(req.userId);
        res.status(200).json(user.chatRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

// new conversation
router.post('/', auth, async (req, res) => {
    if(!req.userId){
        return res.json({message: "You are not authenticated."})
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

module.exports = router;