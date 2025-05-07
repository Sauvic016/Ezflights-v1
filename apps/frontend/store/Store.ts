import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FlightData } from "@repo/types";

export type State = {
  flight: FlightData | null;
};
export type Actions = {
  addFlight: (flightData: FlightData) => void;
  removeFlight: () => void;
};
export const useFlightStore = create<State & Actions>()(
  persist(
    (set) => ({
      flight: null,
      addFlight: (flightData: FlightData) =>
        set(() => ({ flight: flightData })),
      removeFlight: () => set(() => ({ flight: null })),
    }),
    { name: "flight-data" }, // skipHydration is not required anymore
  ),
);

// Contact type based on booking-validator.ts
export type Contact = {
  email: string;
  phone: string;
};

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  PAYPAL = "PAYPAL",
  WALLET = "WALLET",
  OTHER = "OTHER",
}

export enum GenderRole {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Traveler type based on booking-validator.ts
export type Traveler = {
  firstName: string;
  lastName: string;
  dob: string; // or Date
  gender: GenderRole;
  seatNumber?: string;
};

export type UserState = {
  contact: Contact | null;
  travelers: Traveler[];
  paymentMethod?: PaymentMethod;
};

export type UserActions = {
  setContact: (contact: Contact) => void;
  removeContact: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  // Traveler actions
  addTraveler: (traveler: Traveler) => void;
  removeTraveler: (index: number) => void;
  updateTraveler: (index: number, traveler: Traveler) => void;
  clearTravelers: () => void;
};

export const useUserDetails = create<UserState & UserActions>()(
  persist(
    (set) => ({
      contact: null,
      travelers: [],
      paymentMethod: undefined,
      setContact: (contact: Contact) => set(() => ({ contact })),
      removeContact: () => set(() => ({ contact: null })),
      setPaymentMethod: (method: PaymentMethod) =>
        set(() => ({ paymentMethod: method })),
      // Traveler actions
      addTraveler: (traveler: Traveler) =>
        set((state) => ({
          travelers: [...state.travelers, traveler],
        })),
      removeTraveler: (index: number) =>
        set((state) => ({
          travelers: state.travelers.filter((_, i) => i !== index),
        })),
      updateTraveler: (index: number, traveler: Traveler) =>
        set((state) => ({
          travelers: state.travelers.map((t, i) => i === index ? traveler : t),
        })),
      clearTravelers: () => set(() => ({ travelers: [] })),
    }),
    { name: "user-data" },
  ),
);
