const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../model/user");

//Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        req.flash("error", err.message);
        return done(err);
      }
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies and which key is to be sent to the browser
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  async function findUserById(id, done) {
    try {
      const user = await User.findById(id);

      if (!user) {
        // Handle the case where the user is not found
        console.log("User not found --> Passport");
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      console.error("Error in finding user --> Passport", err);
      return done(err);
    }
  }
  findUserById(id, done);
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  //if the user is not signed in
  return res.redirect("/users/sign-in");
};

//set the user for the views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
