"use client";
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./database/mongodb");
const { connectMySql } = require("./database/mysql");
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

// Set port with fallback if the environment variable is not set
const PORT = process.env.MY_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});