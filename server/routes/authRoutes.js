const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");

const authRouter = express.Router();

// Google Auth Route
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback
authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    const token = jwt.sign(
        { userId: req.user._id, name: req.user.name, email: req.user.email, photo: req.user.photo }, 
        process.env.secretKey, 
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,  // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "Strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // res.redirect("https://my-wallet-frontend-liard.vercel.app/dashboard"); // Redirect user after login
    res.redirect("http://localhost:3000/dashboard"); // Redirect user after login
});

// Logout Route
authRouter.get("/logout", (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 0 // This ensures the cookie is deleted
    });

    // If using Google auth, also logout from Passport
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) return res.send("Error logging out");
            res.redirect("https://my-wallet-frontend-liard.vercel.app/");
        });
    } else {
        // For regular JWT auth, just redirect
        res.redirect("https://my-wallet-frontend-liard.vercel.app/");
    }
});

authRouter.get('/verify', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await verifyToken(token);
        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = {authRouter}; 