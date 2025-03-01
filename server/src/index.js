const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./database/mongodb");
const { connectMySql} = require("./database/mysql");
const userRouter = require("./router/user");
const menuRouter = require("./router/menu");
const tableRouter = require("./router/table");
const employeeRouter = require("./router/employee");
const orderRouter = require("./router/order");
const extraRouter = require("./router/extra");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Connect to databases
connectMongoDB();
connectMySql();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.MY_PORT || 6000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", `Broadcast: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(userRouter);
app.use(menuRouter);
app.use(extraRouter);
app.use(tableRouter(io));
app.use(employeeRouter);
app.use(orderRouter(io));


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
