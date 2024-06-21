import  express  from "express";
import { adminDashboard, adminForgotPassword, adminLogin, adminReg, applyJob, createJobpost, getAllJobs } from "../Controllers/adminController.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router=express.Router();

router.post("/adminReg",adminReg)
router.post("/adminLogin",adminLogin)
router.post("/adminForgotPassword",adminForgotPassword)
router.get("/adminDashboard",adminMiddleware,adminDashboard)

router.post("/createJobpost",createJobpost)
router.get("/getAllJobs",getAllJobs)
router.post("/applyJob",applyJob)

export default router;