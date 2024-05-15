const Post = require("../model/post");
const User = require("../model/user");

module.exports.home = function (req, res) {
  //print cookies
  // console.log(req.cookies);
  //change or update cookies in browser
  // res.cookie("hello", 25);

  async function fetchPostsAndRenderPage(req, res) {
    try {
      //populate the user of each post
      const posts = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate("likes")
        .exec();

      const users = await User.find({});

      return res.render("home", {
        title: "Home",
        posts: posts,
        all_users: users,
      });
    } catch (err) {
      console.error("Error in fetching posts:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  fetchPostsAndRenderPage(req, res);
};
