import express from "express";
import {
    createBabysitter,
    getAllBabysitters,
    updateBabysitter,
    deleteBabysitter,
} from "../controllers/babysitter.controller.js";

const router = express.Router();

router.post("/", createBabysitter);

router.get("/", getAllBabysitters);

router.put("/:id", updateBabysitter);

router.delete("/:id", deleteBabysitter);

export default router;
