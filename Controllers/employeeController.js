import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Employee } from "../Models/schema.js";
dotenv.config();

export const employeeReg=async(req,res)=>{
    try {
        const{username,email,password}=req.body;
        const hashPassword= await bcryptjs.hash(password,10);
        const newEmployee=new Employee({
            username,
            email,
            password:hashPassword
        });
        await newEmployee.save();
        res.status(200).json({message:"Employee registered successfully", result:newEmployee})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"registration failed"})
    }
}

export const employeeLogin=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const employee=await Employee.findOne({email});
        if(!employee){
            return res.status(401).json({message:"Employee not found"})
        }
        const passwordMatch=await bcryptjs.compare(password, employee.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"})
        }
        const token = jwt.sign(
            { _id: employee._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          employee.token = token;
          await employee.save();

        res.status(200).json({message:"Employee logged-in successfully",token:token},);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Login failed internal server error'})
    }
}

export const employeeForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "Employee not found" });
        }

        const newPassword = crypto.randomBytes(8).toString('hex');
        const hashPassword = await bcryptjs.hash(newPassword, 10);
        employee.password = hashPassword;
        await employee.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: employee.email,
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
