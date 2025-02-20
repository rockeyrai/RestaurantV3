const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./database/mongodb");
const { connectMySql, mysqlPool } = require("./database/mysql");
const userRouter = require("./router/user")
const menuRouter = require("./router/menu")
const tableRouter = require("./router/table")
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
    credentials: true, // Allow cookies
  })
);
app.use(express.raw({ type: "application/json" }));

const testQuery = async () => {
  try {
    const [rows] = await mysqlPool.query('SELECT 1');
    console.log('Query success:', rows);
  } catch (error) {
    console.error('Query failed:', error.message || error);
  }
};
testQuery();


app.use(userRouter);
app.use(menuRouter)
app.use(tableRouter)

// Set port with fallback if the environment variable is not set
const PORT = process.env.MY_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});