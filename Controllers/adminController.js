import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import { Admin, Job } from "../Models/schema.js";
import dotenv from "dotenv";
dotenv.config();

export const adminReg=async(req,res)=>{
    try {
        const{username,email,password}=req.body;
        const hashPassword= await bcryptjs.hash(password,10);
        const newAdmin=new Admin({
            username,
            email,
            password:hashPassword
        });
        await newAdmin.save();
        res.status(200).json({message:"Admin registered successfully", result:newAdmin})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"registration failed"})
    }
}

export const adminLogin=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(401).json({message:"Admin not found"})
        }
        const passwordMatch=await bcryptjs.compare(password, admin.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"})
        }
        const token = jwt.sign(
            { _id: admin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          admin.token = token;
          await admin.save();

        res.status(200).json({message:"Admin logged-in successfully",token:token,id:admin._id});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Login failed internal server error'})
    }
}

export const adminForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        const newPassword = crypto.randomBytes(8).toString('hex');
        const hashPassword = await bcryptjs.hash(newPassword, 10);
        admin.password = hashPassword;
        await admin.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: 'Password Reset',
            text: `Your new password is: ${newPassword}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Error sending email: ', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    } catch (error) {
        console.error('Error during password reset process: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const adminAuth = async(req,res)=>{
    try {
      const {adminId}=req.params;
      const admin = await Admin.findById(adminId)
      res.status(200).json({message:"Congrats! you're an Authorized admin",data:admin})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error Failed to get the user" });
    }
  }

export const createJobpost=async(req, res) => {
    try {
        const {role,experience,requiredSkills,companyName,location}=req.body;
        const newJob=new Job({
            role,experience,requiredSkills,companyName,location
        })
        await newJob.save();
        res.status(200).json({message:"Job created successfully", result:newJob})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Job creation failed"})
    }
}

export const getAllJobs=async(req,res)=>{
    try {
        const jobs=await Job.find();
        res.status(200).json({message:"All jobs",result:jobs})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getAllAdmin = async (req, res) => {
    try {
        const admins = await Admin.find();

        const totalCount = await Admin.countDocuments();

        res.status(200).json({
            message: "All admins retrieved successfully",
            totalCount: totalCount,
            result: admins
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to retrieve admins" });
    }
}

export const adminResetPassword = async(req,res)=>{
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: "error", message: "Invalid token" });
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            await Admin.findByIdAndUpdate(id, { password: hashedPassword });

            return res.json({ status: "success", message: "Password reset successful" });
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }