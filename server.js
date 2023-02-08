import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { errorHandler, notFound } from "./middleware/error.js";
import upload from "./middleware/fileUpload.js";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";

const PORT = process.env.PORT || 8080;

const app = express();

dotenv.config();

app.use(cors());

app.use(morgan("common"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res, next) => {
  res.send("THIS IS SERVER");
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("CONNECTED MONGODB SUCCESS");
  } catch (error) {
    throw error;
  }
};

mongoose.set("strictQuery", true);

mongoose.connection.on("disconnected", () => {
  console.log("MONGODB DISCONNECTED");
});
mongoose.connection.on("connected", () => {
  console.log("MONGODB CONNECTED");
});

app.use(upload.any()); // multer
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//ROUTES
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

//HANDLE ERROR
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connect();
  console.log("CONNECTED BACKEND SUCCESS", PORT);
});
