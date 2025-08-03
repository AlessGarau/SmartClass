import { Class, ClassFilter, CreateClassParams, GetClassesQueryParams } from "../validate";

export interface IClassInteractor {
    createClass(CreateClassParams: CreateClassParams): Promise<Class>;
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class>;
    getClassesCount(search?: ClassFilter): Promise<number>;
}
