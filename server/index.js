const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const dotenv = require("dotenv").config();
const passport = require("passport");
require("./config/passport"); //  Import the Passport config
const session = require("express-session");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { transactionRouter } = require("./routes/transactionRoutes");
const { accountRouter } = require("./routes/accountRoutes");


const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser()); // Add this to parse cookies
app.use(cors({
    origin: "*"
}));

// 🔹 Add session middleware (BEFORE Passport)
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production", // Set `true` in production if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day session
      },
    })
  );
  

app.use(passport.initialize());
app.use(passport.session());

// Google Auth Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
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

    res.redirect("https://my-wallet-frontend-liard.vercel.app/dashboard"); // Redirect user after login
});

// Logout Route
app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.send("Error logging out");
      res.redirect("https://my-wallet-frontend-liard.vercel.app/");
    });
  });

app.use("/api/v1/user", userRouter)
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/account", accountRouter);

app.get("/", (req, res) => {
    res.json({msg: "Home Page"})
})

app.get("/*", (req, res) => {
    res.json({msg: "Invalid Request"})
})

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`The server is running at ${PORT} and db is connected`);
    } catch  (error){
        console.log("Server error -", error);
    }
}, )
