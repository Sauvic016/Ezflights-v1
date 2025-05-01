import type { Airport as PrismaAirport } from "@repo/database/client";

export type Airport = PrismaAirport;
export type CreateAirportInput = Omit<
  Airport,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateAirportInput = Partial<CreateAirportInput>;
