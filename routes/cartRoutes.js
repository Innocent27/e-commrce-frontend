require("dotenv").config;

const express = require("express");
const User = require("../models/Users");
const { getUser, getProduct } = require("../middleware/get");
const {
  authenticateToken,
  // authTokenAndAdmin,
  // authTokenAndAuthorization,
} = require("../middleware/auth");

const app = express.Router();

// GET USER CART
app.get("/:id", [authenticateToken, getUser], (req, res) => {
  try {
    res.json(res.user.cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ADD PRODUCT TO USER CART
app.post("/:id", [authenticateToken, getProduct], async (req, res) => {
  const user = await User.findById(req.user._id);

  let product_id = res.product._id;
  let title = res.product.title;
  let category = res.product.category;
  let description = res.product.description;
  let img_front = res.product.img_front;
  let img_back = res.product.img_back;
  let price = res.product.price;
  let quantity = req.body.quantity;
  let created_by = req.user._id;

  try {
    user.cart.push({
      product_id,
      title,
      category,
      description,
      img_front,
      img_back,
      price,
      quantity,
      created_by,
    });
    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PRODUCT IN USER CART
app.put("/:id", [authenticateToken, getProduct], async (req, res) => {
  const user = await User.findById(req.user._id);
  const inCart = user.cart.some((prod) => prod.product_id == req.params.id);
  console.log(inCart);

  if (inCart) {
    try {
      const product = user.cart.find(
        (prod) => prod.product_id == req.params.id
      );
      product.quantity = req.body.quantity;
      user.cart.quantity = product.quantity;
      user.markModified("cart");
      const updatedUser = await user.save();
      console.log(updatedUser);
      res.status(201).json(updatedUser.cart);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  }
});

// DELETE PRODUCT IN USER CART'
app.delete("/:id", [authenticateToken, getProduct], async (req, res) => {
  res.send(res.user);
  try {
    await res.user.cart.remove();
    res.json({ message: "Deleted Product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
