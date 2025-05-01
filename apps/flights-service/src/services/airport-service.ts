import { prisma } from "@repo/database/client";
import type { Airport, CreateAirportInput } from "../types/airport-types";

export default class AirportService {
  public async createAirport(data: CreateAirportInput): Promise<Airport> {
    try {
      const response = await prisma.airport.create({
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async createAirports(data: CreateAirportInput[]): Promise<Airport[]> {
    try {
      const response = await prisma.airport.createManyAndReturn({
        data,
        skipDuplicates: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
