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
const { categoryRouter } = require("./routes/categoryRoutes");
const analyticsRouter = require("./routes/analyticRoutes");

const app = express();

const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

// Vercel (and any reverse proxy) terminates TLS, so express-session needs this
// to honour `secure` cookies
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser()); // Add this to parse cookies
app.use(cors({
    origin:  [
        "http://localhost:3000",
        "https://my-wallet-frontend-liard.vercel.app"
      ],  // Your frontend's URL
    credentials: true  // Allow cookies to be sent with requests
}));
app.use("/uploads", express.static("uploads")); 

// 🔹 Add session middleware (BEFORE Passport)
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction, // Set `true` in production if using HTTPS
        httpOnly: true,
        // Chrome rejects SameSite=None unless Secure, so only use it over HTTPS
        sameSite: isProduction ? "None" : "Lax",
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
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get("/", (req, res) => {
    res.json({msg: "Home Page"})
})

app.get("/*", (req, res) => {
    res.json({msg: "Invalid Request"})
})

// On Vercel (@vercel/node) the app itself is the handler; only listen when
// run directly (local `npm run dev`)
if (require.main === module) {
  app.listen(PORT, async () => {
    try {
      await connection;
      console.log(`The server is running at ${PORT} and db is connected ${Date.now()}`);
    } catch  (error){
      console.log("Server error -", error);
    }
  }, )
}

module.exports = app;
