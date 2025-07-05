import { Salle, SalleParams } from "../validate";

export interface ISalleRepository {
  create(SalleParams: SalleParams): Promise<Salle>;
}
