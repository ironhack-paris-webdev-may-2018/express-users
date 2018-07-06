const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Room = require("../models/room-model.js");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});
const storage =
  cloudinaryStorage({
    cloudinary,
    folder: "room-pictures",
    params: {
      resource_type: "raw"
    }
  });
const uploader = multer({ storage });


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

// "pictureUpload" is our file input's name attribute
router.post("/process-room",
  uploader.single("pictureUpload"),
  (req, res, next) => {
    if (!req.user) {
      // "req.flash()" is defined by the "connect-flash" package
      req.flash("error", "You must be logged in.");
      // redirect away if you aren't logged in (authorization!)
      res.redirect("/login");
      return;
    }

    const { name, description, pictureUrl, latitude, longitude } = req.body;
    // multer stores the file information in "req.file"
    const { secure_url } = req.file;
    // create the geoJSON structure for our lat and long
    const location = { coordinates: [ latitude, longitude ] };

    Room.create({
      owner: req.user._id,
      pictureUrl: secure_url,
      name,
      description,
      location,
    })
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
