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
      res.render("car", { cars: cars });
    } else {
      if (users != 0) {
        res.redirect("/login");
      } else {
        res.redirect("/register");
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
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
    res.status(400).json({ error: error });
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
      res.redirect("/register");
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/user/register", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.name === user.name;

      if (!result) {
        const user = new User(req.body);
        await user.save();
        userAuth = false;
        res.redirect("/");
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

router.get("/user/logout", async (req, res, next) => {
  try {
    userAuth = false;
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

      if (!plateNumber) {
        const car = new Car(req.body);
        await car.save();
        setTimeout(() => {
          res.redirect("/car");
        }, 1500);
      }
    } else {
      const car = new Car(req.body);
      await car.save();
      setTimeout(() => {
        res.redirect("/car");
      }, 1500);
    }
  } catch (error) {
    setTimeout(() => {
      res.status(400).json({ error });
    }, 1500);
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

      if (!plateNumber) {
        const rent = new Rent(req.body);
        await rent.save();
        await Car.updateOne(
          { plateNumber: req.body.plateNumber },
          { status: false }
        );
        setTimeout(() => {
          res.redirect("/rent");
        }, 1500);
      }
    } else {
      const rent = new Rent(req.body);
      await rent.save();
      await Car.updateOne(
        { plateNumber: req.body.plateNumber },
        { status: false }
      );
      setTimeout(() => {
        res.redirect("/rent");
      }, 1500);
    }
  } catch (error) {
    setTimeout(() => {
      res.status(400).json({ error });
    }, 1500);
  }
});

router.get("/rent/delete/:rentNumber/:plateNumber", async (req, res, next) => {
  try {
    await Rent.deleteOne({ rentNumber: req.params.rentNumber });
    await Car.updateOne(
      { plateNumber: req.params.plateNumber },
      { status: true }
    );
    setTimeout(() => {
      res.redirect("/rent");
    }, 1500);
  } catch (error) {
    setTimeout(() => {
      res.redirect("/rent");
    }, 1500);
  }
});
//#endregion

module.exports = router;
