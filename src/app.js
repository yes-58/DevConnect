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
    //Saving an instance in the user schema
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
}}
)

// Get User By email
app.get('/user',async (req,res)=>{
  const userEmail = req.body.emailId;
  try{
    const user = await User.findOne({emailId:userEmail})
    if(!user){
      res.status(404).send("User not found.")
    }else{
      res.send(user);
    }
    //const users = await User.find({emailId:userEmail}) //find() returns array of objects
    //if(users.length === 0){
    //  res.status(404).send("User not found.")
    //}else{
    //  res.send(users)
    //}
  }catch(err){
    res.status(400).send("Something went wrong.")
  }
  
})

//Feed API get all the users from the database
app.get('/feed',async (req,res)=>{
  try{
    const users = await User.find({});
    res.send(users);
  }catch(err){
    res.status(400).send("Something went wrong.")
  }
})

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

