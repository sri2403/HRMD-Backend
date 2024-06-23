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
    attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceRecord' }],
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
    payrolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payroll' }],
});

export const Employee = mongoose.model("Employee", employeeSchema);

const payrollSchema= new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    username: { type: String, required: true },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
})
export const Payroll= mongoose.model("Payroll",payrollSchema)

const feedbackSchema=new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    rating:Number,
    feedback:String
})
export const Feedback = mongoose.model("Feedback",feedbackSchema);

const leaveRequestSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    username: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    requestedAt: { type: Date, default: Date.now }
});
export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

const attendanceRecordSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    username: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present',"Absent","On Leave"], required: true },
    recordedAt: { type: Date, default: Date.now }
});
export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);


const candidateSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    dob: String,
    gender: String,
    city: String,
    contact:String,
    college: String,
    sslcMark: String,
    hscMark: String,
    degree: String,
    department: String,
    cgpa:String,
    experience:String,
    domain: String,
    skills: String,
    expectedSalary:String,
    token:String,
    hiringStatus: { type: String, enum: ["Pending", "Hired", "Rejected"], default: 'Pending' },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
})
export const Candidate=mongoose.model('Candidate',candidateSchema)

const jobSchema = new mongoose.Schema({
    role: { type: String, required: true },
    experience: { type: String, required: true },
    requiredSkills: { type: String, required: true },
    companyName: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    appliedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
});

export const Job=mongoose.model('Job', jobSchema);

