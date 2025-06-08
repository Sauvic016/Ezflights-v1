import dotenv from "dotenv";
dotenv.config();

export const EMAIL_ID = process.env.EMAIL_ID;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
