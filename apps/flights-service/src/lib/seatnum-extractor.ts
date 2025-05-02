export function splitSeatNumber(seatNumber: string): {
  rowNumber: number;
  columnLetter: string;
} {
  // Use regex to match the pattern: one or more digits followed by a single letter
  const match = seatNumber.match(/^(\d+)([A-F])$/);

  if (!match) {
    throw new Error("Invalid seat number format");
  }

  // Extract the row number and column letter
  const rowNumber = parseInt(match[1], 10);
  const columnLetter = match[2];

  return { rowNumber, columnLetter };
}
