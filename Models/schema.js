import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})
export const Admin=mongoose.model('Admin',adminSchema)

const employeeSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    dob: String,
    gender: String,
    city: String,
    contact: String,
    role: String,
    degree: String,
    department: String,
    accountNumber: String,
    salary: String,
    token: String,
    leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest' }],
    attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceRecord' }]
});

export const Employee = mongoose.model("Employee", employeeSchema);



const leaveRequestSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    requestedAt: { type: Date, default: Date.now }
});
export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

const attendanceRecordSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present',"Absent","On leave"], required: true },
    recordedAt: { type: Date, default: Date.now }
});
export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);


const candidateSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})
export const Candidate=mongoose.model('Candidate',candidateSchema)