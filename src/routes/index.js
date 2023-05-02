//#region atributos
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Car = require("../models/car");
const Rent = require("../models/rent");

let userAuth = false;

let users;
let cars;
let rents;
//#endregion

//#region functions
async function obtenerDatos() {
  users = await User.find();
  cars = await Car.find();
  rents = await Rent.find();
}
//#endregion

//#region init
router.get("/", async (req, res) => {
  try {
    obtenerDatos();
    if (userAuth) {
      res.render("car", {
        cars: cars,
      });
    } else {
      if (users != 0 && users.length) {
        res.redirect("/login");
      } else {
        res.redirect("/register");
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
//#endregion

//#region user
router.get("/login", async (req, res, next) => {
  try {
    obtenerDatos();
    userAuth = false;
    res.render("login", { users: users, userAuth: userAuth });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/register", async (req, res, next) => {
  try {
    obtenerDatos();
    userAuth = false;
    res.render("login", { users: false, userAuth: userAuth });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/user/login", async (req, res, next) => {
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
router.post("/user/register", async (req, res, next) => {
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
router.get("/user/logout", async (req, res, next) => {
  try {
    res.redirect("/login");
  } catch (error) {
    res.status(400).json({ error });
  }
});
//#endregion

//#region car
router.get("/car", async (req, res) => {
  try {
    obtenerDatos();
    if (userAuth) {
      res.render("car", { cars: cars });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post("/car/register", async (req, res) => {
  try {
    const car = await Car.findOne({ rentNumber: req.body.rentNumber });
    if (car) {
      const plateNumber = req.body.plateNumber === car.plateNumber;
      if (plateNumber) {
        await Car.updateOne({ plateNumber: req.body.plateNumber }, req.body);
      }
      res.redirect("/car");
    } else {
      const car = new Car(req.body);
      await car.save();
      res.redirect("/car");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
//#endregion

//#region rent
router.get("/rent", async (req, res) => {
  try {
    obtenerDatos();
    if (userAuth) {
      res.render("rentacar", {
        users: users,
        cars: cars,
        rents: rents,
      });
    } else {
      res.redirect("/login");
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
      const rent = new Rent(req.body);
      await rent.save();
      res.redirect("/rent");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
//#endregion

module.exports = router;
