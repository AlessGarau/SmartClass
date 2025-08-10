import { CreateTeacherParams, GetTeachersQueryParams, PatchTeacherParams, PutTeacherParams, Teacher, TeacherFilter } from "../validate";

export interface ITeacherInteractor {
    createTeacher(CreateTeacherParams: CreateTeacherParams): Promise<Teacher>;
    getTeachers(params: GetTeachersQueryParams): Promise<Teacher[]>;
    getTeachersCount(search?: TeacherFilter): Promise<number>;
    getTeacher(id: string): Promise<Teacher>;
    putTeacher(id: string, teacherUpdateParams: PutTeacherParams): Promise<Teacher>;
    patchTeacher(id: string, teacherUpdateParams: PatchTeacherParams): Promise<Teacher>;
    deleteTeacher(id: string): Promise<void>;
}
