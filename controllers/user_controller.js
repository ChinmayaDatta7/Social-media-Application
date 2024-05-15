//importing the user model
const User = require("../model/user");
//fs is used to access the file system
const fs = require("fs");
const path = require("path");

const otpMailer = require("../mailers/otp_mailer");

// Render the user profile page
module.exports.profile = function (req, res) {
  // async function checkLoggedInUser(req, res) {
  //   if (req.cookies.user_id) {
  //     try {
  //       const user = await User.findById(req.cookies.user_id);
  //       if (user) {
  //         return res.render("user_profile", {
  //           title: "User Profile",
  //           user: user,
  //         });
  //       }
  //       return res.redirect("/users/sign-in");
  //     } catch (err) {
  //       console.error("Error in checking the logged-in user:", err);
  //       // Handle the error here or send an error response
  //       return res.status(500).json({ error: "Internal Server Error" });
  //     }
  //   } else {
  //     return res.redirect("/users/sign-in");
  //   }
  // }
  // checkLoggedInUser(req, res);
  async function renderUserProfile(req, res) {
    try {
      const user = await User.findById(req.params.id).exec();

      if (!user) {
        // Handle the case where the user does not exist
        return res.status(404).json({ error: "User not found" });
      }

      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
      });
    } catch (err) {
      console.error("Error in rendering user profile:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  renderUserProfile(req, res);
};

// Update the now signed in user's profile
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer Error: ", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          // check if an avatar exists for the user or not! if yes, delete it!
          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            // deleting the avatar
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          //this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        req.flash("success", "Updated!");
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

// Render the user sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Sign Up",
  });
};

// Get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  async function signUpUser(req, res) {
    try {
      // Find the user by email
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        // If the user with the provided email already exists, handle it
        return res.redirect("back");
      }

      // Create a new user if the email is not found
      const newUser = await User.create(req.body);

      return res.redirect("/users/sign-in");
    } catch (err) {
      console.error("Error in signing up:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  signUpUser(req, res);
};

//Render send otp page
module.exports.sendOtp = function (req, res) {
  return res.render("send_otp", {
    title: "Send Otp",
  });
};
//Send OTP
module.exports.sendOtpPost = function (req, res) {
  async function sendOtp(req, res) {
    try {
      //find the user
      const user = await User.findOne({ email: req.body.email });
      //handle user found
      if (user) {
        //if user found
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.save();
        //send otp to the user
        otpMailer.sendOtp(otp, user.email);
        console.log(user.email);
        req.flash("success", "OTP sent!");
        return res.redirect("/users/reset-password");
      }
      //if user not found
      req.flash("error", "User not found!");
      return res.redirect("back");
    } catch (err) {
      console.error("Error in sending otp:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  sendOtp(req, res);
};

//Render reset Password page
module.exports.resetPassword = function (req, res) {
  return res.render("reset_password", {
    title: "Reset Password",
  });
};

//Reset Password
module.exports.resetPasswordPost = function (req, res) {
  async function resetPassword(req, res) {
    try {
      //find the user
      const user = await User.findOne({ email: req.body.email });
      const newPassword = req.body.newPassword;
      console.log(user);
      //handle user found
      if (user) {
        //if user found
        if (user.otp == req.body.otp) {
          user.password = newPassword;
          user.save();
          console.log(user);
          req.flash("success", "Password Reset!");
          return res.redirect("/users/sign-in");
        } else {
          req.flash("error", "Invalid OTP!");
          return res.redirect("back");
        }
      }
      //if user not found
      req.flash("error", "User not found!");
      return res.redirect("back");
    } catch (err) {
      console.error("Error in resetting password:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  resetPassword(req, res);
};

// Render the user sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("user_sign_in", {
    title: "Sign In",
  });
};

// Sign in and create a session for the user
module.exports.createSession = function (req, res) {
  //steps to authenticate withour passport.js
  // async function signInUser(req, res) {
  //   try {
  //     //find the user
  //     const user = await User.findOne({ email: req.body.email });
  //     //handle user found
  //     if (user) {
  //       //handle password which doesn't match
  //       if (!user || user.password != req.body.password) {
  //         return res.redirect("back");
  //       }
  //       //if user found
  //       res.cookie("user_id", user.id);
  //       return res.redirect("/users/profile");
  //     }
  //     //handle user not found
  //     else {
  //       return res.redirect("back");
  //     }
  //   } catch (err) {
  //     //handle error
  //     console.error("Error in signing up:", err);
  //     // Handle the error here or send an error response
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }
  // signInUser(req, res);

  req.flash("success", "Logged in Successfully");
  console.log(req.user);
  console.log(req.user.otp);
  return res.redirect("/");
};

// Sign out and destroy the session for the user
module.exports.destroySession = function (req, res) {
  // res.clearCookie("user_id");

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/");
  });
};
