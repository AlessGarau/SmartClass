import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { SensorInteractor } from "./Interactor";
import { SensorMapper } from "./Mapper";
import { SensorMessage } from "./message";
import { DailySensorDataParamsSchema } from "./validate";

@Service()
export class SensorController {
  constructor(
    private _interactor: SensorInteractor,
    private _mapper: SensorMapper,
  ) {}

  async getDailySensorData(req: FastifyRequest, reply: FastifyReply) {
    const { roomId } = DailySensorDataParamsSchema.parse(req.params);
    const sensorData = await this._interactor.getDailySensorData(roomId);
    
    return reply.status(200).send({
      data: this._mapper.toDailySensorDataResponse(sensorData),
      message: sensorData.length > 0 ? SensorMessage.DAILY_DATA_SUCCESS : SensorMessage.DAILY_DATA_NOT_FOUND,
    });
  }
}
