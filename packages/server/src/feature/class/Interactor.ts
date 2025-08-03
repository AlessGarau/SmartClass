import { Service } from "typedi";
import { ClassError } from "../../middleware/error/classError";
import { IClassInteractor } from "./interface/IInteractor";
import { ClassRepository } from "./Repository";
import { Class, ClassFilter, GetClassesQueryParams } from "./validate";

@Service()
export class ClassInteractor implements IClassInteractor {
  constructor(private _repository: ClassRepository) { }

  async getClasses(params: GetClassesQueryParams): Promise<Class[]> {
    return this._repository.getClasses(params);
  }

  async getClass(id: string): Promise<Class> {
    const c: Class | null = await this._repository.getClass(id);
    if (!c) {
      throw ClassError.notFound();
    }
    return c;
  }

  async getClassesCount(params: ClassFilter): Promise<number> {
    return this._repository.getClassesCount(params);
  }
}
