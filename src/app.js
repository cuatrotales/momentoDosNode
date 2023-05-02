const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/dbRentacar") //Usar el localhost con el puerto de mongoose
  .then((db) => console.log("Database MongoDB - dbRentacar connected"))
  .catch((err) => console.log(err));


const indexRoutes = require("./routes/index");

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded());
app.use("/", indexRoutes);

app.listen(app.get("port"), () => {
  console.log(`http://localhost:${app.get("port")}`);
});