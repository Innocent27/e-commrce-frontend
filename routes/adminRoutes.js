require("dotenv").config;

const express = require("express");
const Admin = require("../models/Admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getAdmin } = require("../middleware/get");

const app = express.Router();

// GET all admins
app.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one admin
app.get("/:id", getAdmin, (req, res) => {
  res.send(res.admin);
});

// LOGIN admin with email + password
app.patch("/", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) res.status(404).json({ message: "Not find an admin" });
  if (await bcrypt.compare(password, admin.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(admin),
        process.env.MONGO_PASS
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Wrong email/password" });
  }
});

// REGISTER an admin
app.post("/", async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = new Admin({
    name,
    email,
    password: hashedPassword,
    phone_number,
  });

  try {
    const newAdmin = await admin.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newAdmin),
        process.env.MONGO_PASS
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE an admin
app.put("/:id", getAdmin, async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  if (name) res.admin.name = name;
  if (email) res.admin.email = email;
  if (phone_number) res.admin.phone_number = phone_number;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    res.admin.password = hashedPassword;
  }

  try {
    const updatedAdmin = await res.admin.save();
    res.status(201).send(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an admin
app.delete("/:id", getAdmin, async (req, res) => {
  try {
    await res.admin.remove();
    res.json({ message: "Deleted admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
