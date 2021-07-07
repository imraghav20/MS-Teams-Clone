const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// register user
router.post('/register', async (req, res) => {
    try {
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // save new user
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }

});

// Login user
router.post('/login', async (req, res) => {
    try{
        // find user in database with request email
        const user = await User.findOne({email: req.body.email});
        // if email not found
        !user && res.status(404).send("User not found!");

        // decrypt password from database and compared with password received from request
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        // if password is not valid
        !isValidPassword && res.status(400).json("Incorrect password!");

        // if password is valid
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json(error);
    }
});

module.exports = router;