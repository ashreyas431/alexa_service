import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import camRoutes from "./routes/camera.js";
// import { ProductMaster, ProductSerialNumberMaster } from "./models/Master.js";
// import { cameraCapabilities, modelNumberMaster, serialNumberMaster } from "./data/data.js";
// import { CameraCapabilities } from "./models/Camera.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/camera", camRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    console.log("Service connected ", PORT);
    // CameraCapabilities.insertMany(cameraCapabilities)
    // await ProductMaster.deleteMany({})
    // await ProductSerialNumberMaster.deleteMany({})
    // ProductMaster.insertMany(modelNumberMaster);
    // ProductSerialNumberMaster.insertMany(serialNumberMaster)
  }).catch(error=>console.error(`${error} did not connect to mongo server`));
