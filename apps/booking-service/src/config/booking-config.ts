import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
