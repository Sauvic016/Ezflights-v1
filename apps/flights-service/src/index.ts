import express from "express";
import dotenv from "dotenv";
import { prisma } from "@repo/database/client";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/info", async (req, res) => {
  const ab = await prisma.city.create({
    data: {
      name: "Bengaluru",
    },
  });
  console.log(ab);
  res.status(200).json({
    message: "flight service is working",
    data: ab,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
