const User = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = require('express').Router();

// add a conversation
router.post('/:chatId', auth, async (req, res) => {
     // return error when user is not authenticated with help of middleware auth
    if(!req.userId){
        return res.json({ message: "You are not authenticated." });
    }

    try {
        const user = await User.findById(req.userId);
        // if new video call roomID already consists of the user
        if(user.chatRooms.includes(req.params.chatId)){  
            res.status(200).json(user);  
        }
        else{
            // if new video call roomID does not consist of the user
            user.chatRooms.push(req.params.chatId);
            const result = await user.save();
            
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = router;