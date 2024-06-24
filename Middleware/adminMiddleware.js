//jwt.verify
import jwt from 'jsonwebtoken';
import { Admin } from '../Models/schema.js';

import dotenv from "dotenv";
dotenv.config();

const adminMiddleware = async(req,res,next)=>{
   //   const token = req.header('Authorization')
     const token = req.headers.authorization?.split(' ')[1]  /// bearer token
     if(!token){
        return res.status(401).json({message:"Token not found"})
     }
     try {
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.admin = decode
        const admin = await Admin.findById(req.admin._id)
       if(!admin){
          return res.status(401).json({message:"Access Denied Not a valid user"})
       }
       next()
     } catch (error) {
        console.log(error);
        res.status(500).json({message:"Invalid Token Internal Server Error"})
     }
}

export default adminMiddleware;