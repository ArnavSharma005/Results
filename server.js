import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();
const PORT = process.env.PORT||3000;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import connectDB from "./config/dbConnect.js";
connectDB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

import busStandRoutes from "./routes/busStandRoutes.js";
app.use("/api/busStand", busStandRoutes);

import busRouteRoutes from "./routes/busRouteRoutes.js";
app.use("/api/busRoute", busRouteRoutes);

import busRoutes from "./routes/busRoutes.js";
app.use("/api/bus", busRoutes);