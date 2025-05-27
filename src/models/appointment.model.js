// src/models/appointment.model.js (dạng module ES6)
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        babysitterId: {
            type: Schema.Types.ObjectId,
            ref: "Babysitter",
        },
        startTime: {
            type: String, // "HH:mm"
        },
        endTime: {
            type: String, // "HH:mm"
        },
        startDate: Date, // ngày bắt đầu (bắt buộc)
        endDate: Date, // nếu là đặt nhiều ngày hoặc full day
        cost: {
            type: Number,
        },
        bookingEmail: {
            type: String,
        },
        bookingPhoneNumber: {
            type: String,
        },
        bookingName: {
            type: String,
        },
        additionalRequest: {
            type: String,
        },
        address: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
