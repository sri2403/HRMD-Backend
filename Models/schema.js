import mongoose from "mongoose";

const adminSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})
export const Admin=mongoose.model('Admin',adminSchema)

const employeeSchema=mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    username:String,
    email:String,
    password:String,
    dob:String,
    gender:String,
    city:String,
    contact:String,
    role:String,
    degree:String,
    department:String,
    accountNumber:String,
    salary:String,
    token:String
})
export const Employee=mongoose.model('Employee',employeeSchema)

const candidateSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})
export const Candidate=mongoose.model('Candidate',candidateSchema)