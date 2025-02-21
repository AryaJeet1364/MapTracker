const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/favicon.ico", express.static("public/favicon.ico"));

io.on("connection", function (socket) {
  console.log("New user connected:", socket.id);

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("send-location", function (data) {
    //   console.log("Received location data:", data);
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    console.log("User disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index.ejs");
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
