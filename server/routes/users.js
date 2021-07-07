const User = require('../models/user');
const bcrypt = require('bcrypt');
const router = require('express').Router();

// get a user 
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { _id, password, createdAt, updatedAt, __v, ...other } = user._doc;
        res.status(200).json(other);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account updated successfully.");
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
    else {
        res.status(403).json('You are allowed to update only your account.');
    }
});

module.exports = router;