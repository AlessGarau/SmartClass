import { Class, ClassFilter, GetClassesQueryParams } from "../validate";

export interface IClassRepository {
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class | null>;
    getClassesCount(params?: ClassFilter): Promise<number>;
}
