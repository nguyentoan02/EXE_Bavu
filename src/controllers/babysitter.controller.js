import Babysitter from "../models/babysitter.model.js";

export const createBabysitter = async (req, res) => {
    try {
        const { name, phoneNumber, email, certificate } = req.body;

        const exists = await Babysitter.exists({ email });
        if (exists) {
            return res
                .status(400)
                .json({ message: "Babysitter already exists with this email" });
        }

        const babysitter = new Babysitter({
            name,
            phoneNumber,
            email,
            certificate,
        });
        await babysitter.save();

        res.status(201).json({
            message: "Babysitter created",
            data: babysitter,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAllBabysitters = async (req, res) => {
    try {
        const babysitters = await Babysitter.find().sort({ createdAt: -1 });
        res.json(babysitters);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get babysitters",
            error: err.message,
        });
    }
};
