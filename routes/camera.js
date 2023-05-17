import express from "express";
import { addCamera,getCameraList, getCameraListWithCapabilities } from "../controllers/camera.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/getcameralist",verifyToken, getCameraList);
router.post("/addcamera", verifyToken, addCamera);
router.post("/getcameraconfig", verifyToken, getCameraListWithCapabilities);

export default router;
