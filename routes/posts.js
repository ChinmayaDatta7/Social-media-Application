const express = require("express");
//express.Router is used to handle the routes
const router = express.Router();
const passport = require("passport");

const postsController = require("../controllers/posts_controller");

//if the user tries to access the posts form throught inspect element then he/she will be redirected to sign in page
router.post("/create", passport.checkAuthentication, postsController.create);

router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postsController.destroy
);

module.exports = router;
