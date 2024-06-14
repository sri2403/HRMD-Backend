import  express  from "express";
import { candidateForgotPassword, candidateLogin, candidateReg } from "../Controllers/candidateController.js";

const router2=express.Router();

router2.post("/candidateReg",candidateReg)
router2.post("/candidateLogin",candidateLogin)
router2.post("/candidateForgotPassword",candidateForgotPassword)

export default router2;