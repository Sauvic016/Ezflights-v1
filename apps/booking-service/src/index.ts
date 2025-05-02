import express from "express";
import dotenv from "dotenv";
import bookingRouter from "./routes/booking-route";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api", bookingRouter);

app.get("/info", (req, res) => {
  res.status(200).json({
    message: "Booking service is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
