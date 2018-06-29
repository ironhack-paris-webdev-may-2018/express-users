const express = require("express");

const Room = require("../models/room-model.js");

const router = express.Router();


router.get("/room/add", (req, res, next) => {
  if (!req.user) {
    // "req.flash()" is defined by the "connect-flash" package
    req.flash("error", "You must be logged in.");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  res.render("room-views/room-form.hbs");
});

router.post("/process-room", (req, res, next) => {
  if (!req.user) {
    // "req.flash()" is defined by the "connect-flash" package
    req.flash("error", "You must be logged in.");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  const { name, description, pictureUrl } = req.body;

  Room.create({ owner: req.user._id, name, description, pictureUrl })
    .then((roomDoc) => {
      // "req.flash()" is defined by the "connect-flash" package
      req.flash("success", "Room created!");
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    })
});

router.get("/my-rooms", (req, res, next) => {
  if (!req.user) {
    // "req.flash()" is defined by the "connect-flash" package
    req.flash("error", "You must be logged in.");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  Room.find({ owner: req.user._id })
    .then((roomResults) => {
      res.locals.roomArray = roomResults;
      res.render("room-views/room-list.hbs");
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
