import { CreateTeacherParams, GetTeachersQueryParams, PatchTeacherParams, PutTeacherParams, Teacher, TeacherFilter } from "../validate";

export interface ITeacherRepository {
    create(TeacherCreateParams: CreateTeacherParams, hashedPassword: string): Promise<Teacher>;
    getTeachers(params: GetTeachersQueryParams): Promise<Teacher[]>;
    getTeachersCount(params?: TeacherFilter): Promise<number>;
    getTeacher(id: string): Promise<Teacher | null>;
    putTeacher(id: string, teacherUpdateParams: PutTeacherParams, hashedPassword: string): Promise<Teacher>;
    patchTeacher(id: string, teacherUpdateParams: PatchTeacherParams): Promise<Teacher>;
    deleteTeacher(id: string): Promise<void>;
}
