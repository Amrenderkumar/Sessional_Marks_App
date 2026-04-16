import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());


app.get("/jokes", (req, res) => {
    const jokes = [
    {
        joke: "Why don't scientists trust atoms? Because they make up everything!"
    },
    {
        joke: "What do you call a fake noodle? An impasta!"
    }
];
res.send(jokes);
});

app.listen(2000, () => {
    console.log("server is connected");
});