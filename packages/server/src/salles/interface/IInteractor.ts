import { Salle, SalleCreateParams } from "../validate";

export interface ISalleInteractor {
  createSalle(CreateSalleCreateParams: SalleCreateParams): Promise<Salle>;
}
