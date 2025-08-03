import { Class, ClassFilter, GetClassesQueryParams } from "../validate";

export interface IClassInteractor {
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class>;
    getClassesCount(search?: ClassFilter): Promise<number>;
}
