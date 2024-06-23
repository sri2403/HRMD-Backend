import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AttendanceRecord, Employee, Feedback, LeaveRequest, Payroll } from "../Models/schema.js";
dotenv.config();

export const employeeReg=async(req,res)=>{
    try {
        const{username,email,password,dob,gender,city,contact,role,degree,department,accountNumber,salary}=req.body;
        const hashPassword= await bcryptjs.hash(password,10);
        const newEmployee=new Employee({
            username,
            email,
            password:hashPassword,dob,gender,city,contact,role,degree,department,accountNumber,salary
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

        res.status(200).json({message:"Employee logged-in successfully",token:token,id: employee._id});
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

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        const totalCount = employees.length; // Get the total count of employees

        res.status(200).json({
            message: "All employees list",
            totalCount: totalCount,
            result: employees
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getEmployeeById=async(req,res)=>{
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({_id: id });
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        res.status(200).json({
            message: "Employee found successfully",
            result: employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Employee finding failed"
        });
    }
}
export const createEmployee=async(req,res)=>{
    try {
        const{username,email,password,dob,gender,city,contact,role,degree,department,accountNumber,salary}=req.body;
        const hashPassword= await bcryptjs.hash(password,10);
        const newEmployee=new Employee({
            username,
            email,
            password:hashPassword,dob,gender,city,contact,role,degree,department,accountNumber,salary
        });
        await newEmployee.save();
        res.status(200).json({message:"Employee created successfully", result:newEmployee})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Employee creation failed"})
    }
}

export const updateEmployee=async(req,res)=>{
    try {
        const { id } = req.params;
        const {
            username, email, password, dob, gender, city, contact, role, degree, department, accountNumber, salary
        } = req.body;
        const employee = await Employee.findOne({ _id: id });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        let updateData = {username,email,dob,gender,city,contact,role,degree,department,accountNumber,salary};

        const updatedEmployee = await Employee.findByIdAndUpdate(employee._id, updateData, { new: true });

        res.status(200).json({
            message: "Employee updated successfully",
            result: updatedEmployee
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({
            message: "Employee update failed"
        });
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = req.params; // Get employee ID from request parameters

    try {
        const deletedEmployee = await Employee.findOneAndDelete({ _id: id });

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully', deletedEmployee });
    } catch (err) {
        console.error('Error deleting employee:', err); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: err.message }); // Respond with detailed error message
    }
};

export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const leaveRequest = new LeaveRequest({
            employee: id, 
            username:employee.username,
            startDate,
            endDate,
            reason,
        });
        await leaveRequest.save();

        employee.leaveRequests.push(leaveRequest._id);
        await employee.save();

        res.status(200).json({
            message: 'Leave request submitted successfully',
            leaveRequest,
        });

    } catch (error) {
        console.error('Error applying for leave:', error);
        res.status(500).json({ message: 'Failed to apply for leave' });
    }
};

export const getLeaveRequests=async(req,res)=>{
    try{
        const LeaveRequests=await LeaveRequest.find();
        res.status(200).json({message:"All leave requests retrived",result:LeaveRequests})
    }catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const approve=async(req,res)=>{
    try {
        const {id}=req.params;
        const leaveRequest=await LeaveRequest.findOne({ _id: id });
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        leaveRequest.status = 'Approved';
        await leaveRequest.save();
        await LeaveRequest.deleteOne({ _id: id });
        await Employee.updateOne(
            { _id: leaveRequest.employee },
            { $pull: { leaveRequests: id } }
        );

        res.status(200).json({
            message: 'Leave request approved successfully',
            leaveRequest
        });
    } catch (error) {
        console.error('Error approving leave:', error);
        res.status(500).json({ message: 'Failed to approve leave' });
    }
}

export const reject=async(req,res)=>{
    try {
        const {id}=req.params;
        const leaveRequest=await LeaveRequest.findOne({ _id: id });
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        leaveRequest.status = 'Rejected';
        await leaveRequest.save();
        await LeaveRequest.deleteOne({ _id: id });
        await Employee.updateOne(
            { _id: leaveRequest.employee },
            { $pull: { leaveRequests: id } }
        );


        res.status(200).json({
            message: 'Leave request rejected successfully',
            leaveRequest
        });
    } catch (error) {
        console.error('Error approving leave:', error);
        res.status(500).json({ message: 'Failed to approve leave' });
    }
}

export const recordAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Find employee by _id
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Record today's date
        const date = new Date();

        // Create attendance record
        const attendanceRecord = new AttendanceRecord({
            username:employee.username,
            employee: id,
            date,
            status,
        });

        // Save attendance record
        await attendanceRecord.save();

        // Update employee's attendance records
        employee.attendanceRecords.push(attendanceRecord._id);
        await employee.save();

        // Respond with success message and attendance record details
        res.status(200).json({
            message: 'Attendance recorded successfully',
            attendanceRecord,
        });

    } catch (error) {
        console.error('Error recording attendance:', error);
        res.status(500).json({ message: 'Failed to record attendance' });
    }
};

export const getAttendanceList=async(req,res)=>{
    try{
        const AttendanceRecords=await AttendanceRecord.find();
        res.status(200).json({message:"All attendance records retrived",result:AttendanceRecords})
    }catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const giveFeedback=async(req,res)=>{
    try {
        const {id}=req.params;
        const {rating,feedback}=req.body;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const newfeedback= new Feedback({
            employee: id, 
            rating,
            feedback,
        });
        await newfeedback.save();
        employee.feedbacks.push(feedback._id);
        await employee.save();
        res.status(200).json({
            message: 'Feedback submitted successfully',
            result: newfeedback,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
}

export const pay=async(req,res)=>{
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const payment = new Payroll({
            employee: id,
            username: employee.username,
            role: employee.role,
            salary: employee.salary,
            status: "Paid",
        });

        await payment.save();

        employee.payrolls.push(payment._id);
        await employee.save();

        res.status(200).json({
            message: 'Payment successful',
            result:payment,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to process payment' });
    }
}

export const getAllEmployeesWithPaystatus = async(req, res) =>{
    try {
        const employees=await Employee.find().populate("payrolls");
        res.status(200).json({message:"All employees list",result:employees})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}