import { Airport, prisma } from "@repo/database/client";
import { createAirportRequest } from "@repo/types";

export default class AirportService {
  public async createAirport(data: createAirportRequest): Promise<Airport> {
    try {
      const response = await prisma.airport.create({
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async createAirports(
    data: createAirportRequest[],
  ): Promise<Airport[]> {
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
