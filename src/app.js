const express = require('express');
const connectToMongoDb = require("../config/database");
const app = express(); //instance of expressjs application
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");

const User = require("../models/user");

app.use(express.json());

app.post('/signup',async (req,res)=>{

  try {
    //Validate Signup Data (Never Trust req.body)
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);

    //Create and Saving an instance in the user schema
    const user = new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash,
    })
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
}}
)
//Login API
app.post('/login',async(req,res)=>{
  
  try{
    const {emailId,password} = req.body;
    //Validating Email Id and check if it is present in DB.
    const user = await User.findOne({emailId:emailId})
    if(!user){
      throw new Error("Invalid Credentials");
    }
    //Check if password is valid or not.
    const isPasswordValid = bcrypt.compare(password,user.password);
    if(isPasswordValid){
      res.send("Login Successful!")
    }else{
      throw new Error("Invalid Credentials");
    }
  }catch(err){
    res.status(400).send("Error: "+err.message);
  }
})

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
//Update User Data API with validations 
app.patch('/user/:userId',async (req,res)=>{
  const data = req.body
  const userId = req.params?.userId;
  try{
    const ALLOWED_UPDATES = ["photoURL", "gender", "age", "skills", "about"]
    const isUpdateAllowed = Object.keys(data).every((k) =>ALLOWED_UPDATES.includes(k))
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({_id:userId},data,{returnDocument:'before',runValidators:true,})
    res.send('User Updated Successfully.')
  }catch(err){
    res.status(400).send("Update Failed"+err.message)
  }
})
//Delete User API
app.delete('/user',async (req,res)=>{
  const userId = req.body.userId
  try{
    const user = await User.findByIdAndDelete(userId)
    //const user = User.findByIdAndDelete({_id:userId})
    res.send("User Deleted Successfully.")
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

