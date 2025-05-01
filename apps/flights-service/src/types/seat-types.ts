import type { Seat as prismaSeat } from "@repo/database/client";

export type Seat = prismaSeat;

export type createSeatInput = Omit<Seat, "id" | "createdAt" | "updatedAt">;
