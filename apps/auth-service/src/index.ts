import express from "express";
import apiRouter from "./routes/user-router";
import { PORT } from "./config/user-config";

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.get("/info", (req, res) => {
  res.status(200).json({
    message: "flight service is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
