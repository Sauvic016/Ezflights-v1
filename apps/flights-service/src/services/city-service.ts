import { City, prisma } from "@repo/database/client";
import { cityRequest } from "@repo/types";

export default class CityService {
  public async createCity(data: cityRequest): Promise<City> {
    try {
      const response = await prisma.city.create({
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getCityById(cityId: number): Promise<City | null> {
    try {
      const city = await prisma.city.findFirst({
        where: {
          id: cityId,
        },
      });
      return city;
    } catch (error) {
      throw error;
    }
  }
  public async getCityByName(cityName: string) {
    try {
      const cities = await prisma.city.findMany({
        where: {
          name: {
            contains: cityName,
            mode: "insensitive",
          },
        },
      });
      return cities;
    } catch (error) {
      throw error;
    }
  }
  public async getAllCities(): Promise<City[]> {
    try {
      const cities = await prisma.city.findMany();
      return cities;
    } catch (error) {
      throw error;
    }
  }

  public async updateCity(
    cityId: number,
    data: cityRequest,
  ): Promise<City> {
    try {
      const city = await prisma.city.update({
        where: {
          id: cityId,
        },
        data,
      });
      return city;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCity(cityId: number): Promise<City> {
    try {
      const deletedCity = await prisma.city.delete({
        where: {
          id: cityId,
        },
      });
      return deletedCity;
    } catch (error) {
      throw error;
    }
  }
}
