import { Class, GetClassesQueryParams } from "../validate";

export interface IClassRepository {
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
}
