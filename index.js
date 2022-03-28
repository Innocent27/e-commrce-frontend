require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const app = express();
app.set("port", process.env.PORT || 2000);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({
    msg: "Welcome to the ecommerce backend ",
  });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/contact", contactRoutes);

app.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${app.get("port")}`);
});
