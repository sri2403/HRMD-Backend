import  express  from "express";
import { candidateForgotPassword, candidateLogin, candidateReg, getAllCandidates, getCandidateById, updateCandidate } from "../Controllers/candidateController.js";

const router2=express.Router();

router2.post("/candidateReg",candidateReg)
router2.post("/candidateLogin",candidateLogin)
router2.post("/candidateForgotPassword",candidateForgotPassword)

router2.get("/getCandidateById/:id",getCandidateById);
router2.put("/updateCandidate/:id",updateCandidate);
router2.get("/getAllCandidates",getAllCandidates)

export default router2;