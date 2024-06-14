import  express  from "express";
import { employeeForgotPassword, employeeLogin, employeeReg } from "../Controllers/employeeController.js";

const router1=express.Router();

router1.post("/employeeReg",employeeReg)
router1.post("/employeeLogin",employeeLogin)
router1.post("/employeeForgotPassword",employeeForgotPassword)

export default router1;
