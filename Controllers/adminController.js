import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import { Admin } from "../Models/schema.js";
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

        res.status(200).json({message:"Admin logged-in successfully",token:token,id: employee._id});
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

export const adminDashboard=async (req, res) => {
    try {
        res.status(200).json({ message:"Welcome to Admin Dashboard"});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}