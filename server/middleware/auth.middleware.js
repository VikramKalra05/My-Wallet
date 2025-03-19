const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");
const dotenv = require("dotenv").config();

const auth = async (req, res, next) => {
    // Check for the presence of token in cookies
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ err: 'Token missing or invalid' });
    }

    // Check if token is blacklisted
    try {
        
        // Verify token
        const decoded = await verifyToken(token);
        req.body.user = decoded;  // Attach user to req
        next();
        
        // jwt.verify(token, process.env.secretKey, (err, decoded) => {
        //     if (err) {
        //         return res.status(403).json({ err: 'Token is invalid or expired' });
        //     }
            
        //     // Attach decoded payload to reaquest and proceed
        //     req.body.user = decoded;
        //     next();
        // });

    } catch (error) {
        res.status(400).send({"err": `Token is invalid or expired: ${error}`});
    }
}

module.exports = {
    auth
}