import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';


dotenv.config();
const app = express();

app.use(
    cors({
        origin: "process.env.FRONTEND_URL",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


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

app.listen(process.env.PORT, () => {
    console.log(`server is connected on port ${process.env.PORT}`);
});