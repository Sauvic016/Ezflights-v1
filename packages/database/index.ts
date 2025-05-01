import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type {
  Airplane,
  Airport,
  Booking,
  City,
  Contact,
  Flight,
  Notification,
  Payment,
  Role,
  Seat,
  Traveler,
  User,
  UserRole,
} from "@prisma/client";

export {
  NotificationStatus,
  PaymentMethod,
  PaymentStatus,
  RoleType,
  StatusType,
} from "@prisma/client";
// Test the database connection
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

export default prisma;
