import express from "express";
import {
    createBabysitter,
    getAllBabysitters,
    updateBabysitter,
    deleteBabysitter,
} from "../controllers/babysitter.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Thêm middleware upload.single('photo') để nhận file ảnh
router.post("/", upload.single("photo"), createBabysitter);
router.put("/:id", upload.single("photo"), updateBabysitter);

router.get("/", getAllBabysitters);
router.delete("/:id", deleteBabysitter);

export default router;
