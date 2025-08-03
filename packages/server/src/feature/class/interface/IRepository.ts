import { Class, ClassFilter, CreateClassParams, GetClassesQueryParams } from "../validate";

export interface IClassRepository {
    create(ClassCreateParams: CreateClassParams): Promise<Class>;
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class | null>;
    getClassesCount(params?: ClassFilter): Promise<number>;
}
