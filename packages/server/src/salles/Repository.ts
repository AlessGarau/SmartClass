import { Pool } from "pg";
import { ISalleRepository } from "./interface/IRepository";
import { SalleCreateParams, Salle } from "./validate";
import { database } from "../../database/database";
import { Service } from "typedi";

@Service()
export class SalleRepository implements ISalleRepository {
  private client: Pool;
  constructor() {
    this.client = database;
  }
  async create(SalleCreateParams: SalleCreateParams): Promise<Salle> {
    const query = "INSERT INTO salle (name) VALUES ($1) RETURNING id, name";
    const values = [SalleCreateParams.name];

    const result = await this.client.query(query, values);
    return result.rows[0];
  }
}
