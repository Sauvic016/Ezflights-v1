import express from "express";

import bookingRouter from "./routes/booking-route";
import cors from "cors";
import { PORT } from "./config/booking-config";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", bookingRouter);

app.get("/info", (req, res) => {
  res.status(200).json({
    message: "Booking service is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
