import { ISalleInteractor } from "./interface/IInteractor";
import { ISalleRepository } from "./interface/IRepository";
import { SalleParams, Salle } from "./validate";

export class SalleInteractor implements ISalleInteractor {
  private repository: ISalleRepository;

  constructor(repository: ISalleRepository) {
    this.repository = repository;
  }
  async createSalle(CreateSalleParams: SalleParams): Promise<Salle> {
    const salle = await this.repository.create(CreateSalleParams);
    return salle;
  }
}
