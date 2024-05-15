const express = require("express");
//express.Router is used to handle the routes
const router = express.Router();
const passport = require("passport");

const commentsController = require("../controllers/comments_controller");

//if the user tries to access the posts form throught inspect element then he/she will be redirected to sign in page
router.post("/create", passport.checkAuthentication, commentsController.create);

router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  commentsController.destroy
);

module.exports = router;
