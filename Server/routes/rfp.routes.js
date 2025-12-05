import express from "express";
import { createRFP, sendRFP, getAllRFP, getRFPById, checkInbox, analyzeRFPProposals } from "../controllers/rfp.controller.js";

const router = express.Router();

router.get("/check-inbox", checkInbox);

router.post("/", createRFP);

router.get("/", getAllRFP);


router.post("/send", sendRFP);

router.get("/:rfpId/analysis", analyzeRFPProposals);

router.get("/:rfpId", getRFPById);


export default router;