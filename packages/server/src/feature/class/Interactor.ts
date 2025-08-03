import { Service } from "typedi";
import { IClassInteractor } from "./interface/IInteractor";
import { ClassRepository } from "./Repository";
import { Class, GetClassesQueryParams } from "./validate";

@Service()
export class ClassInteractor implements IClassInteractor {
  constructor(private _repository: ClassRepository) { }

  async getClasses(params: GetClassesQueryParams): Promise<Class[]> {
    return this._repository.getClasses(params);
  }
}
