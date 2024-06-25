import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Candidate, Job } from "../Models/schema.js";
dotenv.config();

export const candidateReg=async(req,res)=>{
    try {
        const{username,email,password,dob,gender,city,contact,college,sslcMark,hscMark,degree,department,cgpa,experience,domain,skills,expectedSalary}=req.body;
        const hashPassword= await bcryptjs.hash(password,10);
        const newCandidate=new Candidate({
            username,
            email,
            password:hashPassword,
            dob,
            gender,
            city,
            contact,
            college,
            sslcMark,
            hscMark,
            degree,
            department,
            cgpa,
            experience,
            domain,
            skills,
            expectedSalary
        });
        await newCandidate.save();
        res.status(200).json({message:"Candidate registered successfully", result:newCandidate})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"registration failed"})
    }
}

export const candidateLogin=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const candidate=await Candidate.findOne({email});
        if(!candidate){
            return res.status(401).json({message:"Candidate not found"})
        }
        const passwordMatch=await bcryptjs.compare(password, candidate.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"})
        }
        const token = jwt.sign(
            { _id: candidate._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          candidate.token = token;
          await candidate.save();

        res.status(200).json({message:"Candidate logged-in successfully",token:token,id: candidate._id});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Login failed internal server error'})
    }
}

export const candidateForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(401).json({ message: "Candidate not found" });
        }

        const newPassword = crypto.randomBytes(8).toString('hex');
        const hashPassword = await bcryptjs.hash(newPassword, 10);
        candidate.password = hashPassword;
        await candidate.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidate.email,
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

export const getCandidateById=async(req,res)=>{
    try {
        const { id } = req.params;
        const candidate = await Candidate.findOne({_id: id });
        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }
        res.status(200).json({
            message: "Candidate found successfully",
            result: candidate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Candidate finding failed"
        });
    }
}

export const updateCandidate=async(req,res)=>{
    try {
        const { id } = req.params;
        const {username,email,password,dob,gender,city,contact,college,sslcMark,hscMark,degree,department,cgpa,experience,domain,skills,expectedSalary} = req.body;
        const candidate = await Candidate.findOne({ _id: id });

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }
        let updateData = {username,email,password,dob,gender,city,contact,college,sslcMark,hscMark,degree,department,cgpa,experience,domain,skills,expectedSalary};

        const updatedCandidate = await Candidate.findByIdAndUpdate(candidate._id, updateData, { new: true });

        res.status(200).json({
            message: "Candidate updated successfully",
            result: updatedCandidate
        });
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({
            message: "Candidate update failed"
        });
    }
}

export const getAllCandidates=async(req,res)=>{
    try {
        const candidates=await Candidate.find();
        const totalCount = candidates.length;
        res.status(200).json({message:"All Candidates",totalCount: totalCount,result:candidates})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const applyJob = async (req, res) => {
    const { candidateId, jobId } = req.body;

    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        if (candidate.appliedJobs.length === 1) {
            return res.status(400).json({
                message: "The candidate applied for a job earlier, and it's recommended to wait six months before applying for another position."
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        candidate.appliedJobs.push(jobId); 
        await candidate.save();

        job.appliedCandidates.push(candidateId);
        await job.save();

        return res.status(201).json({ message: 'Application submitted successfully', appliedJob: job });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const candidatesWithJob = async (req, res) => {
    try {
        const candidates = await Candidate.find({}).populate('appliedJobs');
        const filteredCandidates = candidates.filter(candidate => candidate.appliedJobs.length === 1);

        if (filteredCandidates.length === 0) {
            return res.status(404).json({ message: "No candidates applied these job" });
        }

        res.status(200).json({ message: "Candidates with exactly one applied job", result: filteredCandidates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const candidateHired= async (req, res) => {
    const {id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.hiringStatus = 'Hired';
        candidate.appliedJobs = [];

        await candidate.save();

        return res.status(200).json({ message: 'Candidate hired successfully' });
    } catch (error) {
        console.error('Error hiring candidate:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const candidateRejected=async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.hiringStatus = 'Rejected';
        candidate.appliedJobs = [];

        await candidate.save();

        return res.status(200).json({ message: 'Candidate rejected successfully' });
    } catch (error) {
        console.error('Error rejecting candidate:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const candidateAuth = async(req,res)=>{
    try {
      const {candidateId}=req.params;
      const candidate = await Candidate.findById(candidateId)
      res.status(200).json({message:"Congrats! you're an Authorized candidate",data:candidate})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error Failed to get the user" });
    }
  }

  export const candidateResetPassword = async(req,res)=>{
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: "error", message: "Invalid token" });
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            await Candidate.findByIdAndUpdate(id, { password: hashedPassword });

            return res.json({ status: "success", message: "Password reset successful" });
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }