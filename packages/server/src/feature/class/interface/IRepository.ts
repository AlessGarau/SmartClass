import type { Class } from "../../../../database/schema/class";

export interface IClassRepository {
  getClassById(id: string): Promise<Class | null>;
  getAllClasses(): Promise<Class[]>;
}