import mongoose from "mongoose";

const connection = () => {
  //Koneksi MongoDB menggunakan Mongoose
  mongoose.connect(`mongodb://localhost:27017`, {
    dbName: "wegodevform",
  });
  const conn = mongoose.connection;
  conn.on("error", console.error.bind(console, "Connection error : "));
  conn.once("open", () => {
    console.log("Connected to mongoDB");
  });
};

export default connection