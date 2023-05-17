import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  modelNumber: {
    type: String,
    required: true
  }
});

const productSerialNumberSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  }
});

export const ProductMaster = mongoose.model("ProductMaster",productSchema);
export const ProductSerialNumberMaster = mongoose.model("ProductSerialNumberMaster",productSerialNumberSchema);
