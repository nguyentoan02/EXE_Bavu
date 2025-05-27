import mongoose from "mongoose";

const BabysitterSchema = new mongoose.Schema(
    {
        name: { type: String },
        phoneNumber: { type: String },
        email: { type: String },
        certificate: { type: String },
    },
    { timestamps: true }
);

const Babysitter = mongoose.model("Babysitter", BabysitterSchema);
export default Babysitter;
