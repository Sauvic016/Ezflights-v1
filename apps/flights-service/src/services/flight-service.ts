import { prisma } from "@repo/database/client";
import { seatGenerator } from "../lib/seat-generator";

import type { Flight, UpdateFlightInput } from "../types/flight-types";
import {
  CreateFlightRequest,
  SeatNumber,
} from "../validators/flight-validator";
import { splitSeatNumber } from "../lib/seatnum-extractor";

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

  public async getFlightById(flightId: string) {
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
        throw new Error("No flight found");
      }

      // Calculate seat availability
      // const bookedSeats = flight.Seat.filter((seat) => seat.isBooked).length;
      // const availableSeats = flight.totalSeats - bookedSeats;

      // return {
      //   ...flight,
      //   seatAvailability: {
      //     availableSeats,
      //     bookedSeats,
      //   },
      // } as FlightWithDetails;
      return flight;
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
  public async reserveSeat(
    flightId: string,
    seatNumbers: SeatNumber[],
  ): Promise<{ success: boolean; reservedSeats: SeatNumber[] }> {
    try {
      // Start a transaction to update all seats
      const result = await prisma.$transaction(async (tx) => {
        const updatedSeats = [];

        for (let seatNumber of seatNumbers) {
          const { rowNumber, columnLetter } = splitSeatNumber(seatNumber);

          // Update the seat to mark it as booked
          const updatedSeat = await tx.seat.updateMany({
            where: {
              flightId: flightId,
              row: rowNumber,
              column: columnLetter,
              isBooked: false, // Additional safety check
            },
            data: {
              isBooked: true,
            },
          });

          // If no seats were updated, something went wrong
          if (updatedSeat.count === 0) {
            throw new Error(`Failed to reserve seat ${seatNumber}`);
          }
          updatedSeats.push(seatNumber);
        }
        return updatedSeats;
      });

      return {
        success: true,
        reservedSeats: result,
      };
    } catch (error) {
      // If anything goes wrong, throw the error
      throw error;
    }
  }
}
