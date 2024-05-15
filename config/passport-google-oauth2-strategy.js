const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../model/user");
const env = require("./environment");

//tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_secert_key,
      callbackURL: env.google_call_back_url,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });

        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
          // If the user is found, set this user as req.user
          return done(null, user);
        } else {
          // If the user is not found, create the user and set it as req.user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });

          return done(null, newUser);
        }
      } catch (err) {
        console.log("Error in Google strategy-passport", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
