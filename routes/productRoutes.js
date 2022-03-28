require("dotenv").config;

const express = require("express");
const Product = require("../models/Products");
const { getProduct } = require("../middleware/get");
const { authenticateToken } = require("../middleware/auth");

const app = express.Router();

// GET all products
app.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one product
app.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

// CREATE a product
app.post("/", async (req, res) => {
  const { title, category, description, img_front, img_back, price } = req.body;

  let product = new Product({
    title,
    category,
    description,
    img_front,
    img_back,
    price,
    created_by: req.user._id,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a product
app.put("/:id", [authenticateToken, getProduct], async (req, res) => {
  if (req.user._id !== res.product.created_by)
    res.status(400).json({
      message: "You do not have the permission to update this product",
    });
  const { title, category, description, img_front, img_back, price } = req.body;
  if (title) res.product.title = title;
  if (category) res.product.category = category;
  if (description) res.product.description = description;
  if (img_front) res.product.img_front = img_front;
  if (img_back) res.product.img_back = img_back;
  if (price) res.product.price = price;

  try {
    const updatedProduct = await res.product.save();
    res.status(201).send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product
app.delete("/:id", [getProduct], async (req, res) => {
  if (req.user._id !== res.product.created_by)
    res.status(400).json({
      message: "Not authorized to delete this product",
    });
  try {
    await res.product.remove();
    res.json({ message: "Deleted product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
