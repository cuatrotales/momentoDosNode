const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Car = require("../models/car");
const Rent = require("../models/rent");

let userAuth = false;

let users;
let cars;
let rents;

//#region init

router.get("/", async (req, res) => {
  try {
    if (userAuth) {
      cars = await Car.find();

      res.render("car", {
        cars: cars,
      });
    } else {
      users = await User.find();
      console.log(users.length);
      if (users != 0 && users.length) {
        res.render("login", { users: users, userAuth: userAuth });
      } else {
        res.render("login", { users: false, userAuth: userAuth });
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//#endregion

//#region user

router.post("/login", async (req, res, next) => {
  try {
    const validUser = await User.findOne({ username: req.body.username });

    if (validUser) {
      const validPass = req.body.password === validUser.password;

      if (validPass) {
        userAuth = true;
        res.redirect("/car");
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

router.post("/registerUser", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.name === user.name;
      if (result) {
        await User.updateOne({ username: req.body.username }, req.body);
      }
      res.redirect("/");
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
    res.render("login", { users: false, userAuth: userAuth });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//#endregion

//#region car
router.get("/car", async (req, res) => {
  try {
    if (userAuth) {
      cars = await Car.find();

      res.render("car", { cars: cars });
    } else {
      res.render("login", { userAuth: userAuth });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
//#endregion

//#region rent

router.get("/rent", async (req, res) => {
  try {
    if (userAuth) {
      rents = await Rent.find();

      res.render("rent", {
        rents,
      });
    } else {
      res.render("login");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/rent/rentacar", async (req, res) => {
  try {
    const rent = await Rent.findOne({ rentNumber: req.body.rentNumber });

    if (rent) {
      const plateNumber = req.body.plateNumber === rent.plateNumber;

      if (plateNumber) {
        await Rent.updateOne({ rentNumber: req.body.rentNumber }, req.body);
      }
    } else {
      const user = new User(req.body);
      await user.save();
      // res.redirect("/");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//#endregion

module.exports = router;
