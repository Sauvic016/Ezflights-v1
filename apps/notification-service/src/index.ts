import express from "express";

import { NotificationService } from "./services/notifier-service";

const notificationService = new NotificationService();

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/info", (req, res) => {
  res.status(200).json({
    message: "flight service is working",
  });
});

notificationService.initialize();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
