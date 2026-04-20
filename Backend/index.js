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


app.post("/api/data", (req, res) => {
    const { name, email } = req.body;
    console.log("Received data:", { name, email });
    res.status(200).json({ message: "Data received successfully", data: { name, email } });
});

app.get("/api/data", (req, res) => {
    const sampleData = [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" }
    ];
    res.status(200).json({ data: sampleData });
});

app.get("/api/hello", (req, res) => {
    res.status(200).json({ message: "Hello from the backend!" });
});

app.get("/jokes", (req, res) => {
    const jokes = [
        {
            joke: "Why don't scientists trust atoms? Because they make up everything!"
        },
        {
            joke: "What do you call a fake noodle? An impasta!"
        }
    ];
    res.status(200).json({ jokes });
});

app.listen(process.env.PORT, () => {
    console.log(`server is connected on port ${process.env.PORT}`);
});