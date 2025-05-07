export const dummyFlights = (
  originId: number,
  destinationId: number,
  destinationName: string,
  originName: string,
  originCityId: number,
  destinationCityId: number,
  originCityName: string,
  departureDate: string,
  destinationCityName: string,
) => ({
  totalItems: 4,
  totalPages: 1,
  Items: [
    {
      id: "EZ00001",
      departureTime: `${departureDate}T12:30:00.000Z`,
      arrivalTime: `${departureDate}T03:30:00.000Z`,
      totalSeats: 180,
      basePrice: 6250,
      origin: {
        id: originId,
        name: originName,
        city: {
          id: originCityId,
          name: originCityName,
        },
      },
      destination: {
        id: destinationId,
        name: destinationName,
        city: {
          id: destinationCityId,
          name: destinationCityName,
        },
      },
      airplane: {
        id: 1,
        model: "Airbus A320",
        totalSeats: 180,
      },
    },
    {
      id: "EZ00002",

      departureTime: `${departureDate}T05:30:00.000Z`,
      arrivalTime: `${departureDate}T08:30:00.000Z`,
      totalSeats: 180,
      basePrice: 6680,
      origin: {
        id: originId,
        name: originName,
        city: {
          id: originCityId,
          name: originCityName,
        },
      },
      destination: {
        id: destinationId,
        name: destinationName,
        city: {
          id: destinationCityId,
          name: destinationCityName,
        },
      },
      airplane: {
        id: 2,
        model: "Airbus A321neo",
        totalSeats: 180,
      },
    },
    {
      id: "EZ00003",
      departureTime: `${departureDate}T10:30:00.000Z`,
      arrivalTime: `${departureDate}T13:30:00.000Z`,
      totalSeats: 360,
      basePrice: 6173,
      origin: {
        id: originId,
        name: originName,
        city: {
          id: originCityId,
          name: originCityName,
        },
      },
      destination: {
        id: destinationId,
        name: destinationName,
        city: {
          id: destinationCityId,
          name: destinationCityName,
        },
      },
      airplane: {
        id: 3,
        model: "Boeing 777",
        totalSeats: 360,
      },
    },
    {
      id: "EZ00004",
      departureTime: `${departureDate}T13:30:00.000Z`,
      arrivalTime: `${departureDate}T16:30:00.000Z`,
      totalSeats: 300,
      basePrice: 7000,
      origin: {
        id: originId,
        name: originName,
        city: {
          id: originCityId,
          name: originCityName,
        },
      },
      destination: {
        id: destinationId,
        name: destinationName,
        city: {
          id: destinationCityId,
          name: destinationCityName,
        },
      },
      airplane: {
        id: 4,
        model: "Airbus A350-900",
        totalSeat: 300,
      },
    },
  ],
});
