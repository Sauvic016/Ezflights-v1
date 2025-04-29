import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/info", (req, res) => {
  res.status(200).json({
    message: "flight service is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
