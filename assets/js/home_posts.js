{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          console.log(data.data.post);
          $("#posts-list-container > ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));

          // call the create comment class
          new PostComments(data.data.post._id);

          //enable the functionality of the toggle like button on the new post
          new ToggleLike($(" .toggle-like-button", newPost));

          // use noty to show a notification
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          //   console.log(data);
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
    <p>
      ${post.content}
      <small class="author"> ${post.user.name} </small>
      
      <span class="delete-post">
        <a class="delete-post-btn" href="/posts/destroy/${post._id}">X</a>
      </span>
      <small>
        <a
          class="toggle-like-button"
          data-likes="0"
          href="/likes/toggle/?id=${post._id}&type=Post"
        >
          <i class="fas fa-thumbs-up"></i> 0 Likes
        </a>
      </small>
      
    </p>
    <div class="post-comments">
      
      <form action="/comments/create" class="new-comment-form" method="POST">
        <input
          type="text"
          name="content"
          placeholder="Type Here to add comment..."
        />
        <input type="hidden" name="post" value="${post._id}" id="" />
        <input type="submit" value="Add Comment" />
      </form>
      
      <div class="post-comments-lists">
        <ul id="post-comments-${post._id}">

          
        </ul>
      </div>
    </div>
  </li>
  `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post and associated comments deleted!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      // let postId = self.prop("id").split("-")[1];
      // new PostComments(postId);
    });
  };

  createPost();
  deletePost();
  convertPostsToAjax();
}
