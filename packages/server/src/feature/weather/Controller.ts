import { Service } from "typedi";
import { FastifyReply, FastifyRequest } from "fastify";
import { WeatherInteractor } from "./Interactor";
import { WeatherMapper } from "./Mapper";

@Service()
export class WeatherController {
  constructor(
    private weatherInteractor: WeatherInteractor,
    private weatherMapper: WeatherMapper,
  ) {}

  async getWeeklyWeather(req: FastifyRequest, reply: FastifyReply) {
    try {
      const weatherData = await this.weatherInteractor.getWeeklyWeather();
      
      return reply.status(200).send({
        data: weatherData,
        message: "Données météo récupérées avec succès",
      });
    } catch (error) {
      console.error("Error in getWeeklyWeather:", error);
      
      return reply.status(500).send({
        error: "Erreur lors de la récupération des données météo",
        data: null,
      });
    }
  }
} 