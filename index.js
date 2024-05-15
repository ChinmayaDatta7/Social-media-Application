const express = require("express");
//pakage used to parse cookies
const cookieParser = require("cookie-parser");
const path = require("path");
const port = 8000;
const app = express();
const env = require("./config/environment");
const logger = require("morgan");
require("./config/view_helpers")(app);
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
//connect-mongo is used to store the session cookie in the db so that when the server restarts the session is not lost
const MongoStore = require("connect-mongo");
//sass middleware
const sassMiddleware = require("node-sass-middleware");
//flash is used to display the flash messages
const flash = require("connect-flash");
const customMware = require("./config/middleware");
//set up the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
// Start your server
chatServer.listen(5000, () => {
  console.log("chat server is listening on port 5000");
});

//sass middleware
if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "/scss"),
      dest: path.join(__dirname, env.asset_path, "/css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

//To parse the form data that is submitted by the user in the post request and to access it in the req.body
app.use(express.urlencoded());

//To use cookies in our app
app.use(cookieParser());

app.use(express.static(env.asset_path));

//make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

//use logger only in development mode
app.use(logger(env.morgan.mode, env.morgan.options));

//it is used above routes so that layouts are rendered before routes
app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(
  session({
    name: "major_project",
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60, //in milliseconds
    },
    //store is used to store the session cookie in the db
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost",
      autoRemove: "disabled",
    }),
  })
);

//session is used above routes so that session is created before routes
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
