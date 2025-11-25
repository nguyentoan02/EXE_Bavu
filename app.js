import express from "express";
import connectDB from "./src/config/db.js";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import babysitterRoutes from "./src/routes/babysitter.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import client from "prom-client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

//  các thông số mặc định của máy (RAM, CPU, Event Loop...)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

//  endpoint "/metrics"
app.get("/metrics", async (req, res) => {
   try {
      res.set("Content-Type", client.register.contentType);
      res.end(await client.register.metrics());
   } catch (ex) {
      res.status(500).end(ex);
   }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/babysitters", babysitterRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
connectDB()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
         console.log(`Metrics available at http://localhost:${PORT}/metrics`);
      });
   })
   .catch((error) => {
      console.log("cannot connect to db", error);
   });
