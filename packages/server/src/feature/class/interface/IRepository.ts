import { Class, ClassFilter, CreateClassParams, GetClassesQueryParams, PatchClassParams, PutClassParams } from "../validate";

export interface IClassRepository {
    create(ClassCreateParams: CreateClassParams): Promise<Class>;
    getClasses(params: GetClassesQueryParams): Promise<Class[]>;
    getClass(id: string): Promise<Class | null>;
    getClassesCount(params?: ClassFilter): Promise<number>;
    putClass(id: string, classUpdateParams: PutClassParams): Promise<Class>;
    patchClass(id: string, classUpdateParams: PatchClassParams): Promise<Class>;
    deleteClass(id: string): Promise<void>;
    getClassByName(name: string): Promise<Class>;
}
