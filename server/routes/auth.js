const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// register user
router.post('/register', async (req, res) => {
    try {
        // checking existing user
        const existingUser = await User.findOne({ email: req.body.email });
        existingUser && res.status(404).json({ message: "User already exists!" });

        // confirming password
        if (req.body.password !== req.body.confirmPassword) {
            res.status(404).json({ message: "Password and confirm password do not match." });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create and save new user
        const result = await User.create({ email: req.body.email, password: hashedPassword, name: `${req.body.firstName} ${req.body.lastName}` });

        // generate new token
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ result, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }

});

// Login user
router.post('/login', async (req, res) => {
    try {
        // find user in database with request email
        const user = await User.findOne({ email: req.body.email });
        // if email not found
        !user && res.status(404).json({ message: "User not found!" });

        // decrypt password from database and compared with password received from request
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        // if password is not valid
        !isValidPassword && res.status(400).json({ message: "Incorrect password!" });

        // if password is valid, generate token
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: user, token });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
});

module.exports = router;