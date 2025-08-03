import { Service } from "typedi";
import { IClassMapper } from "./interface/IMapper";
import { Class, Count } from "./validate";
@Service()
export class ClassMapper implements IClassMapper {
  toGetClassesResponse(classes: Class[]): Class[] {
    return classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      student_count: cls.student_count,
    }));
  }

  toGetClassResponse(c: Class): Class {
    return {
      id: c.id,
      name: c.name,
      student_count: c.student_count,
    };
  }

  toGetTotalClassesResponse(total: number): Count {
    return { count: total };
  }
}
