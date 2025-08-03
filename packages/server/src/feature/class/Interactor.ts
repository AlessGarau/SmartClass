import { Service } from "typedi";
import { ClassError } from "../../middleware/error/classError";
import { IClassInteractor } from "./interface/IInteractor";
import { ClassRepository } from "./Repository";
import { Class, ClassFilter, CreateClassParams, GetClassesQueryParams, PatchClassParams, PutClassParams } from "./validate";

@Service()
export class ClassInteractor implements IClassInteractor {
  constructor(private _repository: ClassRepository) { }

  async createClass(CreateClassParams: CreateClassParams): Promise<Class> {
    const createdClass: Class = await this._repository.create(CreateClassParams);
    if (!createdClass) {
      throw ClassError.creationFailed();
    }
    return createdClass;
  }

  async getClasses(params: GetClassesQueryParams): Promise<Class[]> {
    return this._repository.getClasses(params);
  }

  async getClass(id: string): Promise<Class> {
    const c: Class | null = await this._repository.getClass(id);
    if (!c) {
      throw ClassError.notFound(`Class with ID "${id}" not found.`);
    }
    return c;
  }

  async getClassesCount(params: ClassFilter): Promise<number> {
    return this._repository.getClassesCount(params);
  }

  async putClass(id: string, putClassParams: PutClassParams): Promise<Class> {
    const existingClass: Class | null = await this._repository.getClass(id);
    if (!existingClass) {
      throw ClassError.notFound(`Class with ID "${id}" not found.`);
    }
    const updatedClass: Class = await this._repository.putClass(id, putClassParams);
    if (!updatedClass) {
      throw ClassError.updateFailed();
    }
    return updatedClass;
  }

  async patchClass(id: string, patchClassParams: PatchClassParams): Promise<Class> {
    const existingClass: Class | null = await this._repository.getClass(id);
    if (!existingClass) {
      throw ClassError.notFound(`Class with ID "${id}" not found.`);
    }
    const updatedClass: Class = await this._repository.patchClass(id, patchClassParams);
    if (!updatedClass) {
      throw ClassError.updateFailed();
    }
    return updatedClass;
  }

  async deleteClass(id: string): Promise<void> {
    const c = await this._repository.getClass(id);
    if (!c) {
      throw ClassError.notFound(`Class with ID "${id}" not found.`);
    }
    await this._repository.deleteClass(id);
  }
}
