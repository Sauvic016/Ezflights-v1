import type { Airplane as PrismaAirplane } from "@repo/database/client";

// Base type - complete model with all fields
export type Airplane = PrismaAirplane;

// Type for creating a new flight - omits auto-generated fields
export type CreateAirplane = Omit<Airplane, "id" | "createdAt" | "updatedAt">;

// Type for updating a flight - makes all fields optional
export type UpdateAirplaneInput = Partial<CreateAirplane>;
