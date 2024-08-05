const express = require('express')
const cors = require('cors')
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1844858",
    key: "2d783c6b18f7d45d75a7",
    secret: "23f00a8faa672163512f",
    cluster: "eu",
    useTLS: true
});

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8888', 'http://localhost:4200']
}))

app.use(express.json())

app.post("/api/messages", async (req, res) => {
    await pusher.trigger("chat", "message", {
        username: req.body.username,
        message: req.body.message,
    });

    res.json([]);
})  

console.log('listening to port 8000')
app.listen(8000)