import { prisma } from "@repo/database/client";
import { CreateBookingType } from "../validators/booking-validator";
import axios from "axios";

export default class BookingService {
  async createGuestBooking(data: CreateBookingType) {
    try {
      // 1. Check seat availability first
      const hasSeatAssignments = data.travelers.some((t) => t.seatNumber);
      if (hasSeatAssignments) {
        const seatNumbers = data.travelers.map((t) => t.seatNumber);
        let reserveResponse;
        try {
          reserveResponse = await axios.post(
            `${process.env.FLIGHT_SERVICE_URL}/api/flight/reserve-seat`,
            {
              flightId: data.flightId,
              seatNumbers,
            },
          );
        } catch (error) {
          throw new Error("Failed to reserve seats with flight service");
        }
        if (!reserveResponse.data.success) {
          throw new Error(
            reserveResponse.data.message || "Seat reservation failed",
          );
        }
      }
      // 2. Start transaction for booking creation
      return await prisma.$transaction(async (tx) => {
        // 2.1 Find or create contact
        const contacts = await tx.contact.upsert({
          where: {
            email: data.contact.email,
          },
          update: {
            phone: data.contact.phone,
          },
          create: {
            email: data.contact.email,
            phone: data.contact.phone,
          },
        });

        // 2.2 Create booking
        const booking = await tx.booking.create({
          data: {
            contactId: contacts.id,
            flightId: data.flightId,
            status: "PENDING",
            travelers: {
              create: data.travelers.map((traveler) => ({
                firstName: traveler.firstName,
                lastName: traveler.lastName,
                dob: new Date(traveler.dob),
                seatNumber: traveler.seatNumber,
              })),
            },
          },
          include: {
            travelers: true,
            contact: true,
          },
        });

        // 2.3 Create initial payment record
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: 0, // Will be updated later
            status: "PENDING",
            paymentMethod: data.paymentMethod,
          },
        });

        return booking;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get booking details
  async getBookingById(bookingId: number) {
    return await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelers: true,
        contact: true,
        payments: true,
      },
    });
  }

  // Get all bookings for a contact
  async getBookingsByContact(email: string) {
    return await prisma.booking.findMany({
      where: {
        contact: { email },
      },
      include: {
        travelers: true,
        payments: true,
      },
      orderBy: {
        bookingAt: "desc",
      },
    });
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: number,
    status: "CONFIRMED" | "CANCELLED" | "PENDING",
  ) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
}
