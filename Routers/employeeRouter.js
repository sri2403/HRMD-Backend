import  express  from "express";
import { createEmployee, employeeForgotPassword, employeeLogin, employeeReg, getAllEmployees, updateEmployee } from "../Controllers/employeeController.js";

const router1=express.Router();

router1.post("/employeeReg",employeeReg)
router1.post("/employeeLogin",employeeLogin)
router1.post("/employeeForgotPassword",employeeForgotPassword)
router1.get("/getAllEmployees",getAllEmployees)
router1.post("/createEmployee",createEmployee)
router1.put("/updateEmployee/:id",updateEmployee)

export default router1;
