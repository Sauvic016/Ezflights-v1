import { City as CityData } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CityState = {
  city: {
    arrivalCity: CityData;
    departureCity: CityData;
  };
};
export type CityAction = {
  addDepartureCity: (city: CityData) => void;
  addArrivalCity: (city: CityData) => void;
};

export const useCityStore = create<CityState & CityAction>()(persist(
  (set) => ({
    city: {
      arrivalCity: { id: NaN, name: "" },
      departureCity: { id: NaN, name: "" },
    },
    addDepartureCity: (cityData: CityData) =>
      set((state) => ({ city: { ...state.city, departureCity: cityData } })),
    addArrivalCity: (cityData: CityData) =>
      set((state) => ({ city: { ...state.city, arrivalCity: cityData } })),
  }),
  {
    name: "city-data",
  },
));
