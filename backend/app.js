import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";
import connection from "./connection.js";

const env = dotenv.config().parsed;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);

// catch 404 and forward to error handle
app.use((req, res) => {
  res.status(404).json({
    message: "404_NOT_FOUND",
  });
});

// MongoDb connection
connection();

// setting port
app.listen(env.APP_PORT, () => {
  console.log(`server started on port ${env.APP_PORT}`);
});
