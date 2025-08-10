import { Count, Teacher } from "../validate";

export interface ITeacherMapper {
    toGetTeachersResponse(teachers: Teacher[]): Teacher[];
    toGetTeacherResponse(teacher: Teacher): Teacher;
    toGetTotalTeachersResponse(total: number): Count;
}
