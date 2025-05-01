import { prisma } from "@repo/database/client";
import { seatGenerator } from "../lib/seat-generator";

import type {
  Flight,
  FlightWithDetails,
  UpdateFlightInput,
} from "../types/flight-types";
import { CreateFlightRequest } from "../validators/flight-validator";

export default class FlightService {
  public async createFlight(data: CreateFlightRequest): Promise<Flight> {
    try {
      // Start a transaction to create flight and its seats
      const result = await prisma.$transaction(async (tx) => {
        // 1. Get airplane configuration
        const airplane = await tx.airplane.findUnique({
          where: { id: data.airplaneId },
        });

        if (!airplane) {
          throw new Error("Airplane not found");
        }

        // 2. Create the flight
        const flight = await tx.flight.create({
          data: {
            ...data,
            arrivalTime: new Date(data.arrivalTime),
            departureTime: new Date(data.departureTime),
            totalSeats: airplane.totalSeat, // Add totalSeats from airplane
          },
        });

        // 3. Create seats for this flight based on airplane configuration
        const seats = seatGenerator(airplane.totalSeat, flight.id);

        await tx.seat.createMany({
          data: seats,
        });

        return flight;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getFlightById(
    flightId: string,
  ): Promise<FlightWithDetails | null> {
    try {
      const flight = await prisma.flight.findUnique({
        where: {
          id: flightId,
        },
        include: {
          Seat: true,
          origin: {
            include: {
              city: true,
            },
          },
          destination: {
            include: {
              city: true,
            },
          },
          airplane: true,
        },
      });

      if (!flight) {
        return null;
      }

      // Calculate seat availability
      const bookedSeats = flight.Seat.filter((seat) => seat.isBooked).length;
      const availableSeats = flight.totalSeats - bookedSeats;

      return {
        ...flight,
        seatAvailability: {
          availableSeats,
          bookedSeats,
        },
      } as FlightWithDetails;
    } catch (error) {
      throw error;
    }
  }

  public async getAllFlights(): Promise<Flight[]> {
    try {
      const flights = await prisma.flight.findMany({
        include: {
          origin: {
            include: {
              city: true,
            },
          },
          destination: {
            include: {
              city: true,
            },
          },
          airplane: true,
        },
      });
      return flights;
    } catch (error) {
      throw error;
    }
  }

  public async updateFlight(
    flightId: string,
    data: UpdateFlightInput,
  ): Promise<Flight> {
    try {
      const response = await prisma.flight.update({
        where: {
          id: flightId,
        },
        data: {
          ...data,
          arrivalTime: data.arrivalTime
            ? new Date(data.arrivalTime)
            : undefined,
          departureTime: data.departureTime
            ? new Date(data.departureTime)
            : undefined,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async deleteFlight(flightId: string): Promise<Flight> {
    try {
      // Delete seats first (due to foreign key constraint)
      await prisma.seat.deleteMany({
        where: {
          flightId: flightId,
        },
      });

      // Then delete the flight
      const deletedFlight = await prisma.flight.delete({
        where: {
          id: flightId,
        },
      });
      return deletedFlight;
    } catch (error) {
      throw error;
    }
  }
}
