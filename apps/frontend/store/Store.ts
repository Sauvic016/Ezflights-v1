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

// export type UserState = {
//   contact: Contact | null;
//   travelers: Traveler[];
//   paymentMethod?: PaymentMethod;
// };

// export type UserActions = {
//   setContact: (contact: Contact) => void;
//   removeContact: () => void;
//   setPaymentMethod: (method: PaymentMethod) => void;
//   // Traveler actions
//   addTraveler: (traveler: Traveler) => void;
//   removeTraveler: (index: number) => void;
//   updateTraveler: (index: number, traveler: Traveler) => void;
//   clearTravelers: () => void;
// };

// export const useUserDetails = create<UserState & UserActions>()(
//   persist(
//     (set) => ({
//       contact: null,
//       travelers: [],
//       paymentMethod: undefined,
//       setContact: (contact: Contact) => set(() => ({ contact })),
//       removeContact: () => set(() => ({ contact: null })),
//       setPaymentMethod: (method: PaymentMethod) =>
//         set(() => ({ paymentMethod: method })),
//       // Traveler actions
//       addTraveler: (traveler: Traveler) =>
//         set((state) => ({
//           travelers: [...state.travelers, traveler],
//         })),
//       removeTraveler: (index: number) =>
//         set((state) => ({
//           travelers: state.travelers.filter((_, i) => i !== index),
//         })),
//       updateTraveler: (index: number, traveler: Traveler) =>
//         set((state) => ({
//           travelers: state.travelers.map((t, i) =>
//             i === index ? traveler : t,
//           ),
//         })),
//       clearTravelers: () => set(() => ({ travelers: [] })),
//     }),

//     { name: "user-data" },
//   ),
// );

type StoreState = {
  /** how many passengers the user said they’d book for */
  travelerLimit: number; // default 1
  travelers: Traveler[];
  contact: Contact | null;
  paymentMethod?: PaymentMethod;
};

type StoreActions = {
  /* limit comes from the first step of your flow */
  setTravelerLimit: (n: number) => void;

  setContact: (contact: Contact) => void;
  removeContact: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  addTraveler: (t: Traveler) => boolean; // returns success flag
  removeTraveler: (idx: number) => void;
  updateTraveler: (idx: number, t: Traveler) => void;
  clearTravelers: () => void;

  /* conveniences */
  reset: () => void;
};

export const useUserDetails = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      /* ---------- STATE ---------- */
      travelerLimit: 1, // default to one passenger
      travelers: [],
      contact: null,
      paymentMethod: undefined,

      /* ---------- ACTIONS ---------- */
      setContact: (contact: Contact) => set(() => ({ contact })),
      removeContact: () => set(() => ({ contact: null })),
      setPaymentMethod: (method: PaymentMethod) =>
        set(() => ({ paymentMethod: method })),
      setTravelerLimit: (n) =>
        set((state) => {
          /* if the new limit is _smaller_ than the array, truncate it */
          const trimmed = state.travelers.slice(0, n);
          return { travelerLimit: n, travelers: trimmed };
        }),

      addTraveler: (t) => {
        const { travelers, travelerLimit } = get();
        if (travelers.length >= travelerLimit) return false; // deny
        set({ travelers: [...travelers, t] });
        return true; // accept
      },

      removeTraveler: (idx) =>
        set((state) => ({
          travelers: state.travelers.filter((_, i) => i !== idx),
        })),

      updateTraveler: (idx, t) =>
        set((state) => ({
          travelers: state.travelers.map((x, i) => (i === idx ? t : x)),
        })),

      clearTravelers: () => set({ travelers: [] }),

      reset: () =>
        set({
          travelerLimit: 1,
          travelers: [],
          contact: null,
          paymentMethod: undefined,
        }),
    }),
    {
      name: "user-data",
      /* only persist serialisable data (omit the functions) */
      partialize: (s) => ({
        travelerLimit: s.travelerLimit,
        travelers: s.travelers,
        contact: s.contact,
        paymentMethod: s.paymentMethod,
      }),
      version: 1,
    },
  ),
);
