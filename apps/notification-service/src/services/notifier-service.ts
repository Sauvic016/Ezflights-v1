import amqplib from "amqplib";

// Message queue connection config

import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_ID, RABBITMQ_URL } from "../config/notifier-config";

// // Configure email transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PASS,
  },
});

// Define notification types
interface BookingNotification {
  type: "BOOKING_CREATED" | "BOOKING_STATUS_CHANGED";
  booking: {
    id: number;
    status: string;
    travelers: Array<{
      firstName: string;
      lastName: string;
      seatNumber?: string;
    }>;
    flight: any;
    bookingTime?: Date;
    updateTime?: Date;
  };
  contact: {
    email: string;
    phone: string;
  };
}
// Define correct interface types
interface IConnection {
  createChannel: () => Promise<IChannel>;
  close: () => Promise<void>;
  on: (event: string, listener: (arg?: any) => void) => void;
}

interface IChannel {
  assertQueue: (queue: string, options?: any) => Promise<any>;
  sendToQueue: (queue: string, content: Buffer, options?: any) => boolean;
  close: () => Promise<void>;
  consume: (
    queue: string,
    onMessage: (msg: any) => void,
    options?: any,
  ) => Promise<any>;
  ack: (message: any, allUpTo?: boolean) => void;
  nack: (message: any, allUpTo?: boolean, requeue?: boolean) => void;
}

// Cache the connection
let connection: IConnection | null = null;
let channel: IChannel | null = null;

/**
 * Initialize the message queue connection
 */
export class NotificationService {
  async initializeMessageQueue(): Promise<{
    connection: IConnection | null;
    channel: IChannel | null;
  }> {
    try {
      // Create connection if it doesn't exist
      if (!connection) {
        // Connect and cast to our interface
        connection = (await amqplib.connect(
          RABBITMQ_URL,
        )) as unknown as IConnection;

        // Set up event handlers
        connection.on("close", () => {
          console.log("RabbitMQ connection closed, reconnecting...");
          connection = null;
          channel = null;
          // Attempt to reconnect after a delay
          setTimeout(this.initializeMessageQueue, 5000);
        });

        connection.on("error", (err: Error) => {
          console.error("RabbitMQ connection error:", err);
          connection = null;
          channel = null;
        });
      }

      // Create channel if it doesn't exist
      if (connection && !channel) {
        channel = await connection.createChannel();

        // Setup channel and declare queues
        await channel.assertQueue("notifications", { durable: true });
        await channel.assertQueue("booking-events", { durable: true });
        console.log("Message queue initialized successfully");
      }

      return { connection, channel };
    } catch (error) {
      console.error("Failed to initialize message queue:", error);
      connection = null;
      channel = null;
      throw error;
    }
  }
  async initialize() {
    try {
      console.log("Initializing notification service...");

      // Connect to message queue
      const { channel } = await this.initializeMessageQueue();

      if (!channel) {
        throw new Error("Failed to connect to message queue");
      }

      // Set up consumer for notifications
      channel.consume("notifications", async (msg) => {
        if (!msg) return;

        try {
          // Parse message content
          const content = JSON.parse(msg.content.toString());

          // Process notification
          await this.processNotification(content);

          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing notification:", error);
          // Negative acknowledge with requeue
          channel.nack(msg, false, true);
        }
      });

      console.log(
        "Notification service initialized and listening for messages",
      );
    } catch (error) {
      console.error("Failed to initialize notification service:", error);
      throw error;
    }
  }

  async processNotification(notification: BookingNotification) {
    switch (notification.type) {
      case "BOOKING_CREATED":
        await this.sendBookingConfirmationEmail(notification);
        break;
      case "BOOKING_STATUS_CHANGED":
        await this.sendStatusUpdateEmail(notification);
        console.log("yeah bro updated , got the result");
        break;
      default:
        console.warn("Unknown notification type:", notification.type);
    }
  }

  async sendBookingConfirmationEmail(notification: BookingNotification) {
    const { booking, contact } = notification;

    // Skip if no email provided
    if (!contact.email) {
      console.log("No email address provided, skipping notification");
      return;
    }

    const travelers = booking.travelers
      .map((t) => `${t.firstName} ${t.lastName}`)
      .join(", ");
    const flight = booking.flight;

    // Email content
    const mailOptions = {
      from: EMAIL_ID,
      to: contact.email,
      subject: `Booking Confirmation #${booking.id}`,
      html: `
        <h1>Your Booking is Confirmed!</h1>
        <p>Thank you for booking with EzFlights. Your booking has been received and is now being processed.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
          <li><strong>Travelers:</strong> ${travelers}</li>
          <li><strong>Flight:</strong> ${
            flight ? `#${flight.id}` : "Not specified"
          }</li>
          <li><strong>Departure:</strong> ${
            flight
              ? new Date(flight.departureTime).toLocaleString()
              : "Not specified"
          }</li>
          <li><strong>Arrival:</strong> ${
            flight
              ? new Date(flight.arrivalTime).toLocaleString()
              : "Not specified"
          }</li>
        </ul>
        <p>You can check the status of your booking anytime by logging into your account on our website.</p>
        <p>Thank you for choosing EzFlights!</p>
      `,
    };
    console.log("mailoptions", mailOptions);

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
      console.log("Booking confirmation email sent:", contact.email);
      return info;
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      throw error;
    }
  }

  async sendStatusUpdateEmail(notification: BookingNotification) {
    const { booking, contact } = notification;

    // Skip if no email provided
    if (!contact.email) {
      console.log("No email address provided, skipping notification");
      return;
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "bookings@ezflights.com",
      to: contact.email,
      subject: `Booking Update: Status Changed to ${booking.status} #${booking.id}`,
      html: `
        <h1>Your Booking Status Has Changed</h1>
        <p>Your booking #${booking.id} status has been updated to <strong>${booking.status}</strong>.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>New Status:</strong> ${booking.status}</li>
          <li><strong>Updated At:</strong> ${
            booking.updateTime
              ? new Date(booking.updateTime).toLocaleString()
              : "Just now"
          }</li>
        </ul>
        <p>You can check the status of your booking anytime by logging into your account on our website.</p>
        <p>Thank you for choosing EzFlights!</p>
      `,
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Status update email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Failed to send status update email:", error);
      throw error;
    }
  }
}
