import  express  from "express";
import { applyLeave, createEmployee, deleteEmployee, employeeForgotPassword, employeeLogin, employeeReg, getAllEmployees, getEmployeeById, getLeaveRequests, recordAttendance, updateEmployee } from "../Controllers/employeeController.js";

const router1=express.Router();

router1.post("/employeeReg",employeeReg)
router1.post("/employeeLogin",employeeLogin)
router1.post("/employeeForgotPassword",employeeForgotPassword)

router1.get("/getAllEmployees",getAllEmployees)
router1.get("/getEmployee/:id",getEmployeeById)
router1.post("/createEmployee",createEmployee)
router1.put("/updateEmployee/:id",updateEmployee)
router1.delete("/deleteEmployee/:id",deleteEmployee)

router1.post("/applyLeave/:id",applyLeave)
router1.get("/getLeaveRequests",getLeaveRequests)

router1.post("/recordAttendance/:id",recordAttendance)

export default router1;
