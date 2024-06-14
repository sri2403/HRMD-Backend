import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./Database/config.js";
import router from "./Routers/adminRouter.js";
import router1 from "./Routers/employeeRouter.js";
import router2 from "./Routers/candidateRouter.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(express.json());
connectDB();

app.use("/api",router)
app.use("/api",router1)
app.use("/api",router2)

app.get("/", (req, res) => {
    res.status(200).send("Welcome");
});

app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});