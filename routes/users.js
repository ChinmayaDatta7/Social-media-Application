const express = require("express");
//express.Router is used to handle the routes
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
router.post("/update/:id", passport.checkAuthentication, userController.update);

//rendering the sign up page
router.get("/sign-up", userController.signUp);
//posting the data of sign up page
router.post("/create", userController.create);

//rendering the reset password page
router.get("/reset-password", userController.resetPassword);
//posting the data of reset password page
router.post("/reset-password", userController.resetPasswordPost);

//rendering the send otp page
router.get("/send-otp", userController.sendOtp);
//posting the data of send otp page
router.post("/send-otp", userController.sendOtpPost);

//rendering the sign in page
router.get("/sign-in", userController.signIn);
//posting the data of sign in page
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/users/sign-in",
  }),
  userController.createSession
);

//rendering the sign out page
router.get("/sign-out", userController.destroySession);

//google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//callback url
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  userController.createSession
);

module.exports = router;
