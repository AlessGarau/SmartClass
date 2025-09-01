import { Service } from "typedi";
import { ITeacherMapper } from "./interface/IMapper";
import { Count, Teacher } from "./validate";

@Service()
export class TeacherMapper implements ITeacherMapper {
  toGetTeachersResponse(teachers: Teacher[]): Teacher[] {
    return teachers.map(teacher => ({
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    }));
  }

  toGetTeacherResponse(teacher: Teacher): Teacher {
    return {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  toGetTotalTeachersResponse(total: number): Count {
    return { count: total };
  }
}
