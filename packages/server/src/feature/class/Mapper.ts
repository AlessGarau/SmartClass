import { Service } from "typedi";
import { IClassMapper } from "./interface/IMapper";
import { Class } from "./validate";
@Service()
export class ClassMapper implements IClassMapper {
  toGetClassesResponse(classes: Class[]): Class[] {
    return classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      student_count: cls.student_count,
    }));
  }
}
