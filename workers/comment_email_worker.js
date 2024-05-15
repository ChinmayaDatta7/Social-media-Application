const queue = require("../config/kue");

const commentsMailer = require("../mailers/comments_mailer");

// This is the process function that will be called when a job is added to the queue
queue.process("emails", function (job, done) {
  console.log("Emails worker is processing a job", job.data);

  commentsMailer.newComment(job.data);

  done();
});
