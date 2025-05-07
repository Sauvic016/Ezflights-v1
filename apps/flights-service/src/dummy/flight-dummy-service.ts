import prisma from "@repo/database/client";
import { dummyFlights } from "./dummy";

export default class DummyService {
  public getFlights = async ({
    from,
    to,
    flightType,
    departureDate,
    returnDate,
  }: {
    from: string;
    to: string;
    flightType: string;
    departureDate: string;
    returnDate: string;
  }) => {
    const originCity = await prisma.city.findFirst({
      where: {
        name: {
          contains: from,
          mode: "insensitive",
        },
      },
      include: {
        airports: true,
      },
    });
    const destinationCity = await prisma.city.findFirst({
      where: {
        name: {
          contains: to,
          mode: "insensitive",
        },
      },
      include: {
        airports: true,
      },
    });
    const dummyData = dummyFlights(
      originCity?.airports[0].id!,
      destinationCity?.airports[0].id!,
      destinationCity?.airports[0].name!,
      originCity?.airports[0].name!,
      originCity?.id!,
      destinationCity?.id!,
      originCity?.name!,
      departureDate,
      destinationCity?.name!,
    );
    return dummyData;
  };
  /* originId: number,
  destinationId: number,
  destinationName: string,
  originName: string,
  originCityId: number,
  destinationCityId: number,
  originCityName: string,
  destinationCityName: string, */
}
