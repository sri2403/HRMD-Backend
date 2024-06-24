import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
import { Employee } from '../Models/schema.js';
dotenv.config();

const empMiddleware=async(req,res,next)=>{
    //   const token = req.header('Authorization')
      const token = req.headers.authorization?.split(' ')[1]  /// bearer token
      if(!token){
         return res.status(401).json({message:"Token not found"})
      }
      try {
         const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
         req.employee= decode
         const employee = await Employee.findById(req.employee._id)
        if(!employee){
           return res.status(401).json({message:"Access Denied Not a valid employee"})
        }
        next()
      } catch (error) {
         console.log(error);
         res.status(500).json({message:"Invalid Token Internal Server Error"})
      }
 }

 export default empMiddleware;