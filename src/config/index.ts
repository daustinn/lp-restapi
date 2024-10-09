import express, { type Application } from "express";
import morgan from "morgan";

import cors, { type CorsOptions } from "cors";
import { connectToRedis } from "./redis";
import { routes } from "../routes";
import { errorHandler } from "../middlewares/error";
import { connectToMysqlElp, connectToMysqlIlp } from "../config/database";

// import { connectToSQLite } from "./sqlite";
const PORT = process.env.PORT || 8000;

const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:8000",
    "https://ci.ilp.edu.pe:8000",
    "https://ci.ilp.edu.pe",
  ],
  maxAge: 86400,
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  credentials: true,
};

// CREATE APPLICATION
const app: Application = express();

async function startServer() {
  // MIDDLEWARE
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(morgan("dev"));
  app.use(express.json());

  // CONNECT TO MYSQL
  connectToMysqlIlp();
  connectToMysqlElp();

  // CONNECT TO REDIS
  connectToRedis();

  // CONNECT TO SQLITE
  // connectToSQLite();

  // ROUTES
  app.use("/api/", routes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on --> http://localhost:${PORT}`);
  });
}

startServer();

export default app;
