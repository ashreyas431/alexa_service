import { Camera } from "../models/Camera.js";
import { ProductMaster, ProductSerialNumberMaster } from "../models/Master.js";
import User from "../models/User.js";

export const addCamera = async (req, res) => {
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
        return res.status(401).json({
          status: false,
          data: {
            errorMessage: "User not found"
          }
        });
      }
      checkCamera.map(obj => {
        obj.serialNumber === serialNumber
          ? (snAlreadyAdded = true)
          : (snAlreadyAdded = false);
      });
      if (snAlreadyAdded) {
        return res.status(409).json({
          status: false,
          data: { errorMessage: "Camera already exists" }
        });
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
      return res.status(201).json({ status: true, data: { camera } });
    } else
      return res.status(409).json({
        status: false,
        data: {
          errorMessage:
            "The Serial Number you provided does not match the records in our database"
        }
      });
  } catch (error) {
    res.status(500).json({ status: false, data: { errorMessage: error } });
  }
};

export const getCameraList = async (req, res) => {
  try {
    const { userId } = req.query;
    const camera = await Camera.find({ userId: userId });
    return res.status(200).json({ status: true, data: { camera } });
  } catch (error) {
    res.status(409).json({ status: false, data: { errorMessage: error } });
  }
};

export const getCameraListWithCapabilities = async (req, res) => {
  try {
    const { userId, serialNumber } = req.body;
    const camera = await Camera.find({
      userId: userId,
      serialNumber: serialNumber
    });

    if (camera.length === 0) {
      return res.status(404).json({
        status: false,
        data: {
          errorMessage:
            "The camera is not associated with this account. Please add this camera to get its configuration."
        }
      });
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
        return res.status(200).json({
          status: true,
          data: results2
        });
      })
      .catch(err => {
        console.error("Error performing inner join:", err);
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: { errorMessage: "Internal Error" } });
  }
};
