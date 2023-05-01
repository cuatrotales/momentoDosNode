//const { Router } = require('express');
//const Router = require('express');
const express = require("express");
const router = express.Router(); // El mismo manejo de rutas pero con el método Router de express
const User = require("../models/user");
const Car = require("../models/car");
const Rent = require("../models/rent");

let userAuth = false;

let users;
let cars;
let rents;

router.get("/", async (req, res) => {
  try {
    if (userAuth) {
      cars = await Car.find();

      res.render("index", {
        cars,
      });
    } else {
      users = await User.find();
      if (users && users.length > 0) {
        res.render("login", { users });
      } else {
        res.render("register", { users });
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const validUser = await User.findOne({ username: req.body.username });

    if (validUser) {
      const validPass = req.body.password === validUser.password;

      if (validPass) {
        userAuth = true;
        res.redirect("/");
      } else {
        res.status(400).json({ error: "incorrect password" });
      }
    } else {
      res.render("register");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/register", async (req, res, next) => {
  try {
    users = await User.find();
    res.render("register", { users });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/registerUser", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.name === user.name;
      if (result) {
        await User.updateOne({ username: username }, req.body);
      }
    } else {
      const user = new User(req.body);
      await user.save();
      res.redirect("/");
    }
  } catch (error) {
    res.status(400).json({ error: "No se pudo guardar" });
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    userAuth = false;
    res.render("login");
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
