const Post = require("../model/post");
const Comment = require("../model/comment");
const Like = require("../model/like");

module.exports.create = async function (req, res) {
  async function createPost(req, res) {
    try {
      const post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      });

      // Check if the request is an AJAX request
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post: post,
          },
          message: "Post created!",
        });
      }

      req.flash("success", "Post published!");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", err.message);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  createPost(req, res);
};

module.exports.destroy = async function (req, res) {
  console.log(req.user.id);
  async function deletePostAndComments(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (post.user.toString() === req.user.id.toString()) {
        // delete the associated likes for the post and all its comments' likes too
        await Like.deleteMany({ likeable: post, onModel: "Post" });
        await Like.deleteMany({ _id: { $in: post.comments } });

        await post.deleteOne(); // Use deleteOne to remove the post
        await Comment.deleteMany({ post: req.params.id });

        // Check if the request is an AJAX request
        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id,
            },
            message: "Post deleted!",
          });
        }

        req.flash("success", "Post and associated comments deleted!");
        return res.redirect("back");
      } else {
        req.flash("error", "You cannot delete this post!");
        return res.redirect("back");
      }
    } catch (err) {
      console.error("Error in deleting post and comments:", err);
      req.flash("error", err.message);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  deletePostAndComments(req, res);
};
