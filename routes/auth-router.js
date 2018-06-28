const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");


const router = express.Router();


router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  // password can't be blank and requires a number
  if (originalPassword === "" || originalPassword.match(/[0-9]/) === null) {
    res.redirect("/signup");
    return;  // return instead of else when there's a lot of code
  }

  // we are ready to save the user if we get here
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })
    .then((userDoc) => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, loginPassword } = req.body;

  // check the email by searching the database
  User.findOne({ email })
    .then((userDoc) => {
      // "userDoc" will be falsy if we didn't find a user (wrong email)
      if (!userDoc) {
        res.redirect("/login");
        return;  // return instead of else when there's a lot of code
      }

      // we are ready to check the password if we get here (email was okay)
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return false if the password is wrong
      if (!bcrypt.compareSync(loginPassword, encryptedPassword)) {
        res.redirect("/login");
        return;
      }

      // we are ready to LOG THEM IN if we get here (password was okay too)
      // MISSING: Save the user session
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
