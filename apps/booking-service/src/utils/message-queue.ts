import amqplib from "amqplib";

// Message queue connection config
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

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
export async function initializeMessageQueue(): Promise<{
  connection: IConnection | null;
  channel: IChannel | null;
}> {
  try {
    // Create connection if it doesn't exist
    if (!connection) {
      // Connect and cast to our interface
      connection = await amqplib.connect(
        RABBITMQ_URL,
      ) as unknown as IConnection;

      // Set up event handlers
      connection.on("close", () => {
        console.log("RabbitMQ connection closed, reconnecting...");
        connection = null;
        channel = null;
        // Attempt to reconnect after a delay
        setTimeout(initializeMessageQueue, 5000);
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

export async function publishMessage(
  queue: string,
  message: any,
): Promise<boolean> {
  try {
    // Initialize if not already done
    if (!channel) {
      const result = await initializeMessageQueue();
      if (!result.channel) {
        throw new Error("Failed to create message queue channel");
      }
      channel = result.channel;
    }

    // Publish the message
    const success = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
        contentType: "application/json",
        timestamp: Date.now(),
      },
    );

    if (!success) {
      throw new Error(`Failed to send message to queue '${queue}'`);
    }

    return true;
  } catch (error) {
    console.error(`Error publishing message to ${queue}:`, error);
    throw error;
  }
}

export async function closeMessageQueue(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }

    if (connection) {
      await connection.close();
      connection = null;
    }

    console.log("Message queue connection closed");
  } catch (error) {
    console.error("Error closing message queue connection:", error);
  }
}
