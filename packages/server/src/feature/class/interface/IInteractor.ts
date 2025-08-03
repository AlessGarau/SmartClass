import { Class, ClassFilter, CreateClassParams, GetClassesQueryParams, PatchClassParams, PutClassParams } from "../validate";

export interface IClassInteractor {
    createClass(CreateClassParams: CreateClassParams): Promise<Class>;
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class>;
    getClassesCount(search?: ClassFilter): Promise<number>;
    putClass(id: string, classUpdateParams: PutClassParams): Promise<Class>;
    patchClass(id: string, classUpdateParams: PatchClassParams): Promise<Class>;
    deleteClass(id: string): Promise<void>;
}
