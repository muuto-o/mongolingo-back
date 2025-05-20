import 'module-alias/register'; 
import express from "express";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser"

import userRoutes from "./routes/user";
import unitRoutes from "./routes/unit";
import exerciseRoutes from "./routes/exercise";
import questionRoutes from "./routes/question";
import achievementRoutes from "@/routes/achievement";
import connectDB from "./config/db";
import { authenticateToken } from "./middleware/protect";
// import lessonRoutes from "./routes/lessonRoutes";

async function start(){


  const app = express();

  await connectDB();

  app.use(bodyParser.json())
  app.use(cors());
  // app.use(express.json());

  app.use("/api/users", userRoutes);
  app.use("/api/achievements", achievementRoutes);
  app.use("/api/units", unitRoutes);
  app.use("/api/exercises", exerciseRoutes );
  app.use("/api/questions", authenticateToken,questionRoutes );
  // app.use("/api/lessons", lessonRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("http://localhost:"+PORT)
  });
}

start();
