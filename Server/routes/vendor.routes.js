import express from "express";
import { getAllVendors } from "../controllers/vendor.controller.js";

const router = express.Router();

router.get("/", getAllVendors);

export default router;