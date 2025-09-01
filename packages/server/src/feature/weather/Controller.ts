import { Service } from "typedi";
import { FastifyReply, FastifyRequest } from "fastify";
import { WeatherInteractor } from "./Interactor";
import { WeatherError } from "../../middleware/error/weatherError";

@Service()
export class WeatherController {
  constructor(
    private weatherInteractor: WeatherInteractor,
  ) {}

  async getWeeklyWeather(_: FastifyRequest, reply: FastifyReply) {
    try {
      const weatherData = await this.weatherInteractor.getWeeklyWeather();

      return reply.status(200).send({
        data: weatherData,
        message: "Données météo récupérées avec succès",
      });
    } catch (error) {
      throw WeatherError.apiFetchFailed();
    }
  }
}
