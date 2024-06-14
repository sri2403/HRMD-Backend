import mongoose from "mongoose";

const adminSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})
export const Admin=mongoose.model('Admin',adminSchema)

const employeeSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
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