import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  selectedSeats: {
    [key: number]: {
      id?: number;
      seatNum?: string;
      price?: number;
    };
  };
  totalPrice: number;
  basePrice: number;
  seatPrice: number;
}

interface BookingActions {
  setSelectedSeat: (
    travelerIndex: number,
    seat: { id: number; seatNum: string; price: number },
  ) => void;
  removeSelectedSeat: (travelerIndex: number) => void;
  setBasePrice: (price: number) => void;
  clearBooking: () => void;
}

const initialState: BookingState = {
  selectedSeats: {},
  totalPrice: 0,
  basePrice: 0,
  seatPrice: 0,
};

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedSeat: (travelerIndex, seat) =>
        set((state) => {
          const newSelectedSeats = {
            ...state.selectedSeats,
            [travelerIndex]: seat,
          };
          const seatPrice = Object.values(newSelectedSeats).reduce(
            (total, seat) => total + (seat.price || 0),
            0,
          );
          return {
            selectedSeats: newSelectedSeats,
            seatPrice,
            totalPrice: state.basePrice + seatPrice,
          };
        }),

      removeSelectedSeat: (travelerIndex) =>
        set((state) => {
          const newSelectedSeats = { ...state.selectedSeats };
          delete newSelectedSeats[travelerIndex];
          const seatPrice = Object.values(newSelectedSeats).reduce(
            (total, seat) => total + (seat.price || 0),
            0,
          );
          return {
            selectedSeats: newSelectedSeats,
            seatPrice,
            totalPrice: state.basePrice + seatPrice,
          };
        }),

      setBasePrice: (price) =>
        set((state) => ({
          basePrice: price,
          totalPrice: price + state.seatPrice,
        })),

      clearBooking: () => set(initialState),
    }),
    {
      name: "booking-storage",
    },
  ),
);
