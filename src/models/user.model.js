import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
});

const User = mongoose.model("User", UserSchema);
export default User;
