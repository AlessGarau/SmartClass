import bcrypt from "bcrypt";
import { Service } from "typedi";
import { TeacherError } from "../../middleware/error/teacherError";
import { ITeacherInteractor } from "./interface/IInteractor";
import { TeacherRepository } from "./Repository";
import { CreateTeacherParams, GetTeachersQueryParams, PatchTeacherParams, PutTeacherParams, Teacher, TeacherFilter } from "./validate";

@Service()
export class TeacherInteractor implements ITeacherInteractor {
  constructor(private _repository: TeacherRepository) { }

  async createTempPassword(): Promise<string> {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    return hashedPassword;
  }

  async createTeacher(CreateTeacherParams: CreateTeacherParams): Promise<Teacher> {
    const createdTeacher: Teacher = await this._repository.create(CreateTeacherParams, await this.createTempPassword());
    if (!createdTeacher) {
      throw TeacherError.creationFailed();
    }
    return createdTeacher;
  }

  async getTeachers(params: GetTeachersQueryParams): Promise<Teacher[]> {
    return this._repository.getTeachers(params);
  }

  async getTeachersCount(params: TeacherFilter): Promise<number> {
    return this._repository.getTeachersCount(params);
  }

  async getTeacher(id: string): Promise<Teacher> {
    const teacher: Teacher | null = await this._repository.getTeacher(id);
    if (!teacher) {
      throw TeacherError.notFound(`Teacher with ID "${id}" not found.`);
    }
    return teacher;
  }

  async putTeacher(id: string, putTeacherParams: PutTeacherParams): Promise<Teacher> {
    const existingTeacher: Teacher | null = await this._repository.getTeacher(id);
    if (!existingTeacher) {
      throw TeacherError.notFound(`Teacher with ID "${id}" not found.`);
    }
    const updatedTeacher: Teacher = await this._repository.putTeacher(id, putTeacherParams, await this.createTempPassword());
    if (!updatedTeacher) {
      throw TeacherError.updateFailed();
    }
    return updatedTeacher;
  }

  async patchTeacher(id: string, patchTeacherParams: PatchTeacherParams): Promise<Teacher> {
    const existingTeacher: Teacher | null = await this._repository.getTeacher(id);
    if (!existingTeacher) {
      throw TeacherError.notFound(`Teacher with ID "${id}" not found.`);
    }
    if (patchTeacherParams.password) {
      patchTeacherParams.password = await bcrypt.hash(patchTeacherParams.password, 10);
    }
    const updatedTeacher: Teacher = await this._repository.patchTeacher(id, patchTeacherParams);
    if (!updatedTeacher) {
      throw TeacherError.updateFailed();
    }
    return updatedTeacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    const existingTeacher = await this._repository.getTeacher(id);
    if (!existingTeacher) {
      throw TeacherError.notFound(`Teacher with ID "${id}" not found.`);
    }
    await this._repository.deleteTeacher(id);
  }
}