const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        let decodedData = jwt.verify(token, secret);
        req.userId = decodedData?.id;

        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports = auth;