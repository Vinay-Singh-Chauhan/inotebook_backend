const express=require('express');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const router=express.Router();
const User=require('../models/User')
const fetchUser=require('../middleware/fetchUser')
const mongoose =require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env.local' });
const { Schema } = mongoose;
const { body, validationResult } = require('express-validator');
const JWT_SECRET=process.env.JWT_SECRET

//creating a user no login required
router.post('/createUser',
    body('name',"enter a valid name").isLength({ min: 3 }),
    body('email',"enter a valid email").isEmail(),
    body('password',"enter a valid password").isLength({ min: 5 }),
    async (req,res)=>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false,errors: errors.array() });
    }
    try
    {
      //checking unique email condition
      let user=await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({success:false,
        error:"sorry email already exists"
      })
    }
    //salt and hashing to secure password
    let salt=await bcrypt.genSalt(10);

    let secPass= await bcrypt.hash( req.body.password,salt)
    //create user
    user=await User.create({
      name: req.body.name,
      email:req.body.email,
      password: secPass,
    })
    const data={
      user:{
        id:user.id
      }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    // console.log(authToken)
    res.json({success:true,authToken})}
    catch(error){
      console.log(error.message);
      res.status(500).send("some error")
    }    
})


//logging in a user no login required
router.post('/login',
    body('email',"enter a valid email").isEmail(),
    body('password',"enter password").exists(),
    async (req,res)=>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log("1")
      return res.status(400).json({ success:false,errors: errors.array() });
    }
    const {email,password}=req.body;

    try
    {
      let user=await User.findOne({email})
    if(!user){
      // console.log("2")

      return res.status(400).json({success:false,
        error:"invalid credentials"
      })
    }

    const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      // console.log("3")

      return res.status(400).json({
        success:false,
        error:"invalid credentials"
      })
    }
   
    const data={
      user:{
        id:user.id
      }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    // console.log(authToken)
    res.json({success:true,authToken})}
    catch(error){
      console.log(error.message);
      res.status(500).send("some error")
    }    
})
module.exports=router;



// get user details
router.post('/getUser',fetchUser,
    // body('email',"enter a valid email").isEmail(),
    // body('password',"enter password").exists(),
    async (req,res)=>{
        // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
      // console.log("1")
      // return res.status(400).json({ errors: errors.array() });
    // }
    // const {email,password}=req.body;

    try
    {
      let UserId=req.user.id;

      let user=await User.findById(UserId).select("-password")
      res.send(user)
    // if(!user){
    //   // console.log("2")

    //   return res.status(400).json({
    //     error:"invalid credentials"
    //   })
    // }

    // const passwordCompare=await bcrypt.compare(password,user.password);
    // if(!passwordCompare){
    //   // console.log("3")

    //   return res.status(400).json({
        
    //     error:"invalid credentials"
    //   })
    // }
   
    // const data={
    //   user:{
    //     id:user.id
    //   }
    // }
    // const authToken=jwt.sign(data,JWT_SECRET);
    // // console.log(authToken)
    // res.json({authToken})
  }
    catch(error){
      console.log(error.message);
      res.status(500).send("some error")
    }    
})
module.exports=router;