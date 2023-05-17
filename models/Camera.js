import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  modelNumberId: {
    type: Number,
    required: true
  },
  friendlyName: {
    type: String,
    required: true
  },
  streamUrl: {
    type: String,
    required: true
  }
});

const cameraCapabilitiesSchema = new mongoose.Schema({
  modelNumberId: {
    type: Number,
    required: true
  },
  videoCodecs: {
    type: [String],
    required: true
  },
  audioCodecs: {
    type: [String]
  },
  protocols: {
    type: [String],
    required: true
  },
  manufacturer: {
    type: String
  },
  authorization: {
    type: [String],
    required: true
  },
  resolution: {
    type: [
      {
        width: Number,
        height: Number
      }
    ],
    required: true
  }
});

export const Camera = mongoose.model("Camera", cameraSchema);
export const CameraCapabilities = mongoose.model(
  "CameraCapabilities",
  cameraCapabilitiesSchema
);
