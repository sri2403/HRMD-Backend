import  express  from "express";
import {  adminAuth, adminForgotPassword, adminLogin, adminReg,  adminResetPassword,  createJobpost, getAllAdmin, getAllJobs } from "../Controllers/adminController.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router=express.Router();

router.post("/adminReg",adminReg)
router.post("/adminLogin",adminLogin)
router.post("/adminForgotPassword",adminForgotPassword)
router.get("/adminAuth/:adminId",adminMiddleware,adminAuth)

router.post("/createJobpost",createJobpost)
router.get("/getAllJobs",getAllJobs)

router.get("/getAllAdmin",getAllAdmin)

router.post("/adminResetPassword/:id",adminResetPassword)


export default router;