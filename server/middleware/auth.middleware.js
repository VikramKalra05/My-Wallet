const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklistModel");
const dotenv = require("dotenv").config();

const auth = async (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ err: 'Token missing or invalid' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    try {
        const blacklist = await BlacklistModel.findOne({token});
        if (blacklist) {
            return res.status(403).json({ err: 'Token blacklisted or expired' });
        }

        // Verify token
        jwt.verify(token, process.env.secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ err: 'Token is invalid or expired' });
            }
            
            // Attach decoded payload to request and proceed
            req.body.decoded = decoded;
            next();
        });
        
    } catch (error) {
        res.status(400).send({"err": `Error in Authorization- ${error}`});
    }
}

module.exports = {
    auth
}