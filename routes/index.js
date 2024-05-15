const express = require("express");
const router = express.Router();

//getting home controller
const homeController = require("../controllers/home_controller");

console.log("router loaded");

//route to home page
router.get("/", homeController.home);

// route to users.js file for further routing
router.use("/users", require("./users"));
// route to posts.js file for further routing
router.use("/posts", require("./posts"));
// route to comments.js file for further routing
router.use("/comments", require("./comments"));
// route to api folder for further routing
router.use("/api", require("./api"));
// route to likes.js file for further routing
router.use("/likes", require("./likes"));

//for any further routes, access from here
//router.use('/routerName', require('./routerfile));

module.exports = router;
