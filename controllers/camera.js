import { Camera } from "../models/Camera.js";
import { ProductMaster, ProductSerialNumberMaster } from "../models/Master.js";
import User from "../models/User.js";
import { logger } from "../logger/logger.js";

export const addCamera = async (req, res) => {
  logger.info(JSON.stringify({ api: "/camera/addcamera", ...req.body }));
  try {
    const { userId, serialNumber, modelNumber, friendlyName } = req.body;
    const productId = await ProductMaster.find({ modelNumber: modelNumber });
    const doesSerialNumberExist = await ProductSerialNumberMaster.find({
      serialNumber: serialNumber
    });

    if (
      productId.length > 0 &&
      doesSerialNumberExist.length > 0 &&
      productId[0].id === doesSerialNumberExist[0].id
    ) {
      var snAlreadyAdded = false;
      const checkCamera = await Camera.find({ serialNumber: serialNumber });
      const user = await User.findById(userId);
      if (!user) {
        const response = {
          success: false,
          data: {
            errorMessage: "User not found"
          }
        };
        logger.info(JSON.stringify(response));
        return res.status(401).json(response);
      }
      checkCamera.map(obj => {
        obj.serialNumber === serialNumber
          ? (snAlreadyAdded = true)
          : (snAlreadyAdded = false);
      });
      if (snAlreadyAdded) {
        const response = {
          success: false,
          data: { errorMessage: "Camera already exists" }
        };
        logger.info(JSON.stringify(response));
        return res.status(409).json(response);
      }
      const newCamera = new Camera({
        userId: user.id,
        serialNumber,
        modelNumberId: productId[0].id,
        friendlyName,
        streamUrl:
          "rtsp://admin:admin123@alexa.cppluscloud.com:443/cam/realmonitor?channel=1&subtype=0"
      });
      await newCamera.save();
      const camera = await Camera.find({ userId: user.id });
      const response = { success: true, data: { camera } };
      logger.info(JSON.stringify(response));
      return res.status(201).json(response);
    } else {
      const response = {
        success: false,
        data: {
          errorMessage:
            "The Serial Number you provided does not match the records in our database"
        }
      };
      logger.info(JSON.stringify(response));
      return res.status(409).json(response);
    }
  } catch (error) {
    const errorResponse = { success: false, data: { errorMessage: error } };
    logger.error(JSON.stringify(errorResponse));
    res.status(500).json(errorResponse);
  }
};

export const getCameraList = async (req, res) => {
  logger.info(JSON.stringify({ api: "/camera/getcameralist", ...req.query }));
  try {
    const { userId } = req.query;
    const camera = await Camera.find({ userId: userId });
    const response = { success: true, data: { camera } };
    logger.info(JSON.stringify(response));
    return res.status(200).json(response);
  } catch (error) {
    const errorResponse = { success: false, data: { errorMessage: error } };
    logger.error(JSON.stringify(errorResponse));
    res.status(500).json(errorResponse);
  }
};

export const getCameraListWithCapabilities = async (req, res) => {
  logger.info(JSON.stringify({ api: "/camera/getcameraconfig", ...req.body }));
  try {
    const { userId, serialNumber } = req.body;
    const camera = await Camera.find({
      userId: userId,
      serialNumber: serialNumber
    });

    if (camera.length === 0) {
      const response = {
        success: false,
        data: {
          errorMessage:
            "The camera is not associated with this account. Please add this camera to get its configuration."
        }
      };
      logger.info(JSON.stringify(response));
      return res.status(404).json(response);
    }
    Camera.aggregate([
      {
        $lookup: {
          from: "cameracapabilities",
          localField: "modelNumberId",
          foreignField: "modelNumberId",
          as: "coniguration"
        }
      },
      {
        $unwind: "$modelNumberId"
      }
    ])
      .then(results => {
        const results2 = results.filter(
          obj => obj.serialNumber === serialNumber
        );
        const response = {
          success: true,
          data: results2
        };
        logger.info(JSON.stringify(response));
        return res.status(200).json(response);
      })
      .catch(err => {
        logger.error("Error performing inner join:", err);
        console.error("Error performing inner join:", err);
      });
  } catch (error) {
    const errorResponse = {
      success: false,
      data: { errorMessage: "Internal Error" }
    };
    logger.error(JSON.stringify(errorResponse));
    return res.status(500).json(errorResponse);
  }
};
