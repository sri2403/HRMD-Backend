import  express  from "express";
import { applyLeave, approve, createEmployee, deleteEmployee, employeeAuth, employeeForgotPassword, employeeLogin, employeeReg, getAllEmployees,  getAllEmployeesWithPaystatus,  getAttendanceList, getEmployeeById, getLeaveRequests, giveFeedback, pay, recordAttendance, reject, updateEmployee } from "../Controllers/employeeController.js";
import empMiddleware from "../Middleware/empMiddleware.js";

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
router1.put("/approve/:id",approve)
router1.put("/reject/:id",reject)

router1.post("/recordAttendance/:id",recordAttendance)
router1.get("/getAttendanceList",getAttendanceList)

router1.post("/giveFeedback/:id",giveFeedback)

router1.post("/pay/:id",pay)
router1.get("/getAllEmployeesWithPaystatus",getAllEmployeesWithPaystatus)

router1.get("/employeeAuth/:employeeId",empMiddleware,employeeAuth )


export default router1;
