import { Service } from "typedi";
import { FastifyReply, FastifyRequest } from "fastify";
import { WeatherInteractor } from "./Interactor";

@Service()
export class WeatherController {
  constructor(private weatherInteractor: WeatherInteractor) {}

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