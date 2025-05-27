import Appointment from "../models/appointment.model.js";

// Hàm helper convert "HH:mm" thành phút
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

export const createAppointment = async (req, res) => {
    try {
        const userId = req.user.id; // lấy từ token middleware
        const {
            babysitterId,
            startTime,
            endTime,
            bookingEmail,
            bookingPhoneNumber,
            bookingName,
            additionalRequest,
            address,
        } = req.body;

        // Validate startTime < endTime
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        if (endMinutes <= startMinutes) {
            return res
                .status(400)
                .json({ message: "End time must be after start time" });
        }

        const durationMinutes = endMinutes - startMinutes;
        const pricePerHour = 100000;
        const cost = (durationMinutes / 60) * pricePerHour;

        const appointment = new Appointment({
            userId,
            babysitterId,
            startTime,
            endTime,
            cost,
            bookingEmail,
            bookingPhoneNumber,
            bookingName,
            additionalRequest,
            address,
            status: "pending",
        });

        await appointment.save();

        res.status(201).json({
            message: "Appointment created successfully",
            data: appointment,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Admin cập nhật trạng thái Appointment
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "pending",
            "in_progress",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({
            message: "Appointment status updated successfully",
            data: appointment,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("userId", "email")
            .populate("babysitterId", "name email");
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get appointments",
            error: err.message,
        });
    }
};
// Lấy danh sách appointments của một người dùng cụ thể
export const getAppointmentsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const appointments = await Appointment.find({ userId })
            .populate("userId", "email")
            .populate("babysitterId", "name email");

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                message: "No appointments found for this user",
            });
        }

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get appointments for user",
            error: err.message,
        });
    }
};

export const createDailyAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            babysitterId,
            startDate,
            endDate,
            bookingEmail,
            bookingPhoneNumber,
            bookingName,
            additionalRequest,
            address,
        } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const dayInMs = 24 * 60 * 60 * 1000;
        const totalDays = Math.ceil((end - start) / dayInMs) + 1; // Bao gồm cả ngày bắt đầu và kết thúc

        const costPerDay = 500000;
        const totalCost = totalDays * costPerDay;

        const appointment = new Appointment({
            userId,
            babysitterId,
            startDate,
            endDate,
            cost: totalCost,
            bookingEmail,
            bookingPhoneNumber,
            bookingName,
            additionalRequest,
            address,
            status: "pending",
        });

        await appointment.save();

        res.status(201).json({
            message: "Daily appointment created successfully",
            data: appointment,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};
