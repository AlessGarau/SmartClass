import { Salle, SalleCreateParams } from "../validate";

export interface ISalleRepository {
  create(SalleCreateParams: SalleCreateParams): Promise<Salle>;
}
