import { Service } from "typedi";
import { IClassMapper } from "./interface/IMapper";
import { Class, Count } from "./validate";
@Service()
export class ClassMapper implements IClassMapper {
  toGetClassesResponse(classes: Class[]): Class[] {
    return classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      studentCount: cls.studentCount,
    }));
  }

  toGetClassResponse(c: Class): Class {
    return {
      id: c.id,
      name: c.name,
      studentCount: c.studentCount,
    };
  }

  toGetTotalClassesResponse(total: number): Count {
    return { count: total };
  }
}
