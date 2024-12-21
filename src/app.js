const express = require('express');
const connectToMongoDb = require("../config/database");
const app = express(); //instance of expressjs application

const User = require("../models/user");

app.use(express.json());

app.post('/signup',async (req,res)=>{
  // Creating a new instance of the User model
//   const user = new User({
//     firstName: "Sachin",
//     lastName: "Tendulkar",
//     emailId: "sachin@kohli.com",
//     password: "sachin@123",
//   });

  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
}}
)

connectToMongoDb()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });

