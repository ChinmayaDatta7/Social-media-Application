module.exports.chatSockets = function (socketServer) {
  const Server = require("socket.io");
  //It will be handling the connections
  let io = Server(socketServer, {
    // Fixing the cors issue
    cors: {
      origin: "http://localhost:8000",
      credentials: true,
    },
    allowEIO3: true, // false by default
  });

  //whenever a connection is established then this callback function is called
  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);

    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
      console.log("A user disconnected");
    });

    //whenever someone sends a message then this piece of code is executed
    socket.on("join_room", function (data) {
      console.log("received", data);

      //joining the chatroom
      socket.join(data.chatroom);

      io.to(data.chatroom).emit("user_joined", data);
    });

    //detect send_message and broadcast it to everyone in the room
    socket.on("send_message", function (data) {
      io.to(data.chatroom).emit("receive_message", data);
    });

    //detect typing and broadcast it to everyone in the room
    socket.on("typing", function (data) {
      socket.broadcast.emit("typing", data);
    });
  });
};
