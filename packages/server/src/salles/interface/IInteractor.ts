import { Salle, SalleParams } from "../validate";

export interface ISalleInteractor {
  createSalle(CreateSalleParams: SalleParams): Promise<Salle>;
}
