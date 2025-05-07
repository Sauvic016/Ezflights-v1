export type City = {
  id: number;
  name: string;
};

export type Airport = {
  id: string;
  name: string;
  city: City;
};

export type Airplane = {
  id: number;
  model: string;
  totalSeats: number;
};

export type FlightData = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  basePrice: number;
  origin: Airport;
  destination: Airport;
  airplane: Airplane;
};
