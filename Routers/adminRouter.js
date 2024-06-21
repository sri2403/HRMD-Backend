import  express  from "express";
import { adminDashboard, adminForgotPassword, adminLogin, adminReg, createJobpost } from "../Controllers/adminController.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router=express.Router();

router.post("/adminReg",adminReg)
router.post("/adminLogin",adminLogin)
router.post("/adminForgotPassword",adminForgotPassword)
router.get("/adminDashboard",adminMiddleware,adminDashboard)

router.post("/createJobpost",createJobpost)

export default router;