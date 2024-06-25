import  express  from "express";
import { applyJob, candidateAuth, candidateForgotPassword, candidateHired, candidateLogin, candidateReg, candidateRejected,  candidatesWithJob, getAllCandidates, getCandidateById, updateCandidate } from "../Controllers/candidateController.js";
import candMiddleware from "../Middleware/candMiddleware.js";

const router2=express.Router();

router2.post("/candidateReg",candidateReg)
router2.post("/candidateLogin",candidateLogin)
router2.post("/candidateForgotPassword",candidateForgotPassword)

router2.get("/getCandidateById/:id",getCandidateById);
router2.put("/updateCandidate/:id",updateCandidate);
router2.get("/getAllCandidates",getAllCandidates)

router2.post("/applyJob",applyJob)
router2.get("/candidatesWithJob",candidatesWithJob)

router2.post("/candidateHired/:id",candidateHired)
router2.post("/candidateRejected/:id",candidateRejected)

router2.get("/candidateAuth/:candidateId",candMiddleware,candidateAuth )


export default router2;