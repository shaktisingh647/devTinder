const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const { userAuth } = require('./middlewares/auth');
const User = require("./models/user");

// Middleware Setup
app.use(express.json());
app.use(cookieParser()); // Place cookie-parser before route handlers

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Database Connection and Server Start
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((error) => {
    console.error('Error while connecting to the database', error);
  });
















