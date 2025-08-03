import { Class, GetClassesQueryParams } from "../validate";

export interface IClassInteractor {
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
}
