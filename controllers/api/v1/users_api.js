const User = require("../../../model/user");
//jsonwebtoken is used to generate signed token
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");

module.exports.createSession = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid username/password",
      });
    }
    return res.json(200, {
      message: "Sign in successful, here is your token, please keep it safe!",
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret, {
          expiresIn: "1000000",
        }),
      },
    });
  } catch (err) {
    console.log("Error in creating session", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
