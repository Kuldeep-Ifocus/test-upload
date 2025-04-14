import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import playwrightRoutes from "./src/routes//playwrightRoutes.js";
import connectDB from "./src/config/connectDB.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

// Routes
app.use("/", playwrightRoutes);

//health route
app.get("/health", (req, res) => {
  res.send("Server is working fine!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
