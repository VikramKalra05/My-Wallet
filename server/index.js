const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const dotenv = require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json())

app.use("/api/v1/user", userRouter)

app.get("/", (req, res) => {
    res.json({msg: "Home Page"})
})

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`The server is running at ${PORT} and db is connected`);
    } catch  (error){
        console.log("Server error -", error);
    }
}, )

// module.exports = async (req, res) => {
//     await connection;
//     return app(req, res)
// }