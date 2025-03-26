const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const dotenv = require("dotenv").config();
const passport = require("passport");
require("./config/passport"); //  Import the Passport config
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { transactionRouter } = require("./routes/transactionRoutes");
const { accountRouter } = require("./routes/accountRoutes");
const { authRouter } = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser()); // Add this to parse cookies
app.use(cors({
    origin: "http://localhost:3000",  // Your frontend's URL
    credentials: true  // Allow cookies to be sent with requests
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

app.use("/api/v1/auth", authRouter); 
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
        console.log(`The server is running at ${PORT} and db is connected ${Date.now()}`);
    } catch  (error){
        console.log("Server error -", error);
    }
}, )
