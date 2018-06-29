const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../models/user-model.js");


passport.use(new GoogleStrategy({
  // settings for the strategy
  clientID: process.env.google_id,
  clientSecret: process.env.google_secret,
  callbackURL: "/google/success",
  proxy: true  // need this for production version to work 🤷‍
}, (accessToken, refreshToken, profile, done) => {
  // what will happen every time a user logs in with Google
  console.log("GOOGLE profile ~~~~~~~~~~~~~~~~~~~~~~~~~~", profile);

  const { id, displayName, emails } = profile;

  User.findOne({
    $or: [
      { googleID: id },
      { email: emails[0].value }
    ]
  })
  .then((userDoc) => {
    if (userDoc) {
      // if we found a user, they already signed up so just log them in.
      done(null, userDoc);
      return;
    }

    // otherwise create a new user account for them before loggin in
    User.create({
      googleID: id,
      fullName: displayName,
      email: emails[0].value
    })
    .then((userDoc) => {
      // log in the newly created user account
      done(null, userDoc);
    });
  })
  .catch((err) => {
    done(err);
  });
}));
