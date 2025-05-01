import type { City as PrismaCity } from "@repo/database/client";

export type City = PrismaCity;

export type CreateCityInput = Omit<City, "id" | "createdAt" | "updatedAt">;

export type UpdateCityInput = Partial<CreateCityInput>;
