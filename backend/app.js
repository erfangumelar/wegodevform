import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./connection.js";

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
connection()

app.listen(3000, () => {
  console.log("server started on port 3000");
});
