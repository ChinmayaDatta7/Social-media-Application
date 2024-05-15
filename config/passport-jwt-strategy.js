const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
//extracting the JWT from the header
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../model/user");
const env = require("./environment");

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTStrategy(opts, async function (jwtPayload, done) {
    try {
      const user = await User.findById(jwtPayload._id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("Error in finding user from JWT", err);
      return done(err);
    }
  })
);

module.exports = passport;
