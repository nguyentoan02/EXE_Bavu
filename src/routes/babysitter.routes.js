import express from "express";
import {
    createBabysitter,
    getAllBabysitters,
} from "../controllers/babysitter.controller.js";

const router = express.Router();

router.post("/", createBabysitter);

router.get("/", getAllBabysitters);

export default router;
