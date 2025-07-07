import { Service } from "typedi";
import { ISalleInteractor } from "./interface/IInteractor";
import { SalleCreateParams, Salle } from "./validate";
import { SalleRepository } from "./Repository";
import { SalleError } from "../error/salleError";

@Service()
export class SalleInteractor implements ISalleInteractor {
  constructor(private repository: SalleRepository) {}

  async createSalle(
    CreateSalleCreateParams: SalleCreateParams
  ): Promise<Salle> {
    const salle = await this.repository.create(CreateSalleCreateParams);

    if (!salle) {
      throw SalleError.creationFailed();
    }

    return salle;
  }
}
