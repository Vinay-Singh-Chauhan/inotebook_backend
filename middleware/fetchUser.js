const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env.local' });
const JWT_SECRET=process.env.JWT_SECRET

const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"error"})
    }
    try{
        let data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next()
    }
    catch{
        res.status(401).send({error:"error"})
    }
}
module.exports=fetchUser