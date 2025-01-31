const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user')
const { userAuth } = require('./middlewares/auth');
const User = require("./models/user");
const cors = require('cors')
const PORT = process.env.PORT || 4000;
require('dotenv').config()
// Middleware Setup



// Allow requests from your frontend on Vercel
const allowedOrigins = ["https://dev-tinder-web-one.vercel.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies & authentication headers
  })
);

app.use(express.json());
app.use(cookieParser()); // Place cookie-parser before route handlers

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);
// Database Connection and Server Start
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((error) => {
    console.error('Error while connecting to the database', error);
  });
















