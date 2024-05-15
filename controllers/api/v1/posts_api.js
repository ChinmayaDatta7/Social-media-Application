const Post = require("../../../model/post");
const Comment = require("../../../model/comment");

module.exports.index = async function (req, res) {
  const posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.json(200, {
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  async function deletePostAndComments(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (post.user.toString() === req.user.id.toString()) {
        await post.deleteOne(); // Use deleteOne to remove the post
        await Comment.deleteMany({ post: req.params.id });

        // Check if the request is an AJAX request
        //   if (req.xhr) {
        //     return res.status(200).json({
        //       data: {
        //         post_id: req.params.id,
        //       },
        //       message: "Post deleted!",
        //     });

        //   req.flash("success", "Post and associated comments deleted!");
        return res
          .status(200)
          .json({ message: "Post and associated comments deleted!" });
      } else {
        return res
          .status(401)
          .json({ message: "You cannot delete this post!" });
      }
    } catch (err) {
      console.error("Error in deleting post and comments:", err);
      // req.flash("error", err.message);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  deletePostAndComments(req, res);
};
