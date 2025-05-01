import { prisma } from "@repo/database/client";
import type {
  Airplane,
  CreateAirplane,
  UpdateAirplaneInput,
} from "../types/airplane-types";

export default class AirplaneService {
  public async createAirplane(data: CreateAirplane): Promise<Airplane> {
    try {
      const response = await prisma.airplane.create({
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async createAirplanes(data: CreateAirplane[]): Promise<Airplane[]> {
    try {
      const response = await prisma.airplane.createManyAndReturn({
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAirplaneById(airplaneId: number): Promise<Airplane | null> {
    try {
      const airplane = await prisma.airplane.findFirst({
        where: {
          id: airplaneId,
        },
      });
      return airplane;
    } catch (error) {
      throw error;
    }
  }
  public async getAllAirplanes(): Promise<Airplane[]> {
    try {
      return await prisma.airplane.findMany();
    } catch (error) {
      throw error;
    }
  }
  public async updateAirplane(
    airplaneId: number,
    data: UpdateAirplaneInput,
  ): Promise<Airplane> {
    try {
      const response = await prisma.airplane.update({
        where: {
          id: airplaneId,
        },
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async deleteAirplane(airplaneId: number): Promise<Airplane> {
    try {
      const deletedAirplane = await prisma.airplane.delete({
        where: {
          id: airplaneId,
        },
      });
      return deletedAirplane;
    } catch (error) {
      throw error;
    }
  }
}
