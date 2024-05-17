require("dotenv").config(); // enable dotenv

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const router = require("./route");
const { errorHandler } = require("./middleware");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const options = {
  cors: {
    origin: "*",
    methods: "*",
  },
};
const io = new Server(httpServer, options);

// enable cors, to allow access from frontend to server (cloud)
app.use(cors());

app.use(express.json()); // body -> json
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.NODE_ENV === "development" ? "./tmp" : "/tmp",
  })
); // body -> form-data

app.use(express.static("public"));

app.use(async function (req, res, next) {
  req.io = io;
  next();
});

app.use("/api", router);

/* In the end of route or after the last route */
app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  });
});

// Error middleware
app.use(errorHandler);


io.on("connection", (socket) => {
  console.log(socket.id + " connected!");

  /* ... */
  socket.on("disconnect", (reason) => {
    console.log(socket.id + " disconnected because " + reason);
  });

  socket.on("typing", () => {
    console.log("aku ditrigger");
    io.emit("ontyping");
  });
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
