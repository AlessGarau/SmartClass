import { Pool } from "pg";
import { ISalleRepository } from "./interface/IRepository";
import { SalleParams, Salle } from "./validate";
import { database } from "../../database/database";

export class SalleRepository implements ISalleRepository {
  private client: Pool;
  constructor() {
    this.client = database;
  }
  async create(SalleParams: SalleParams): Promise<Salle> {
    const query = "INSERT INTO salle (name) VALUES ($1) RETURNING id, name";
    const values = [SalleParams.name];

    const result = await this.client.query(query, values);
    return result.rows[0];
  }
}
