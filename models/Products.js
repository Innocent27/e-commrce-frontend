const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img_front: {
    type: String,
    required: true,
    default: "https://picsum.photos/1920",
  },
  img_back: {
    type: String,
    required: true,
    default: "https://picsum.photos/1920",
  },
  price: {
    type: Number,
    required: true,
  },
  created_by: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
