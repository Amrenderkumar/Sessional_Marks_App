import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import authRoutes from './routes/user.route.js';


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
app.use("/api/v1/auth", authRoutes); 

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});



app.listen(process.env.PORT, () => {
    console.log(`server is connected on port ${process.env.PORT}`);
});