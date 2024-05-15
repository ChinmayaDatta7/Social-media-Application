const Comment = require("../model/comment");
const Post = require("../model/post");
const Like = require("../model/like");

// for sending mails using queue
const commentsMailer = require("../mailers/comments_mailer");
const queueMicrotask = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async function (req, res) {
  async function createComment(req, res) {
    try {
      const post = await Post.findById(req.body.post);

      if (post) {
        const comment = await Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        });

        post.comments.push(comment);
        await post.save();

        await comment.populate("user", "_id name email");
        commentsMailer.newComment(comment);
        let job = queueMicrotask.create("emails", comment).save(function (err) {
          if (err) {
            console.log("Error in creating a queue", err);
            return;
          }
          console.log("Job enqueued", job.id);
        });
        if (req.xhr) {
          // Similar for comments to fetch the user's id!
          return res.status(200).json({
            data: {
              comment: comment,
            },
            message: "Comment created!",
          });
        }
        req.flash("success", "Comment published!");
        return res.redirect("/");
      }
    } catch (err) {
      console.error("Error in creating comment:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  createComment(req, res);
};

module.exports.destroy = async function (req, res) {
  async function deleteComment(req, res) {
    try {
      const comment = await Comment.findById(req.params.id);

      if (comment.user.toString() === req.user.id.toString()) {
        const postId = comment.post;

        comment.deleteOne();

        await Post.findByIdAndUpdate(postId, {
          $pull: { comments: req.params.id },
        });

        //destroy the associated likes for this comment
        await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

        // send the comment id which was deleted back to the views
        if (req.xhr) {
          return res.status(200).json({
            data: {
              comment_id: req.params.id,
            },
            message: "Comment deleted",
          });
        }
        req.flash("success", "Comment deleted!");
        return res.redirect("back");
      } else {
        req.flash("error", "Unauthorized");
        return res.redirect("back");
      }
    } catch (err) {
      console.error("Error in deleting comment:", err);
      // Handle the error here or send an error response
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  deleteComment(req, res);
};
