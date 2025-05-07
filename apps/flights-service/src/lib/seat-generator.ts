import { createSeatInput } from "../types/seat-types";
import { SeatClass } from "@repo/database/client";

export const seatGenerator = (totalSeat: number, flightId: string) => {
  const columns = ["A", "B", "C", "D", "E", "F"];
  const totalRows = totalSeat / 6;
  const seats: Array<createSeatInput> = [];

  // Calculate the number of rows for each class
  const firstClassRows = Math.max(1, Math.floor(totalRows * 0.1)); // 10% of total rows
  const businessClassRows = Math.max(2, Math.floor(totalRows * 0.15)); // 15% of total rows
  const premiumEconomyRows = Math.max(2, Math.floor(totalRows * 0.15)); // 15% of total rows
  // Remaining rows will be economy class

  for (let row = 1; row <= totalRows; row++) {
    let seatClass: SeatClass;

    // Determine seat class based on row number
    if (row <= firstClassRows) {
      seatClass = SeatClass.FIRST_CLASS;
    } else if (row <= firstClassRows + businessClassRows) {
      seatClass = SeatClass.BUSINESS;
    } else if (row <= firstClassRows + businessClassRows + premiumEconomyRows) {
      seatClass = SeatClass.PREMIUM_ECONOMY;
    } else {
      seatClass = SeatClass.ECONOMY;
    }

    for (const column of columns) {
      seats.push({
        row,
        column,
        seatClass,
        flightId,
        isBooked: false,
      });
    }
  }

  return seats;
};
