import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import router from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// 🟢 Connect to MongoDB
connectDB();


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("🚀 Server is running on", port);
});
