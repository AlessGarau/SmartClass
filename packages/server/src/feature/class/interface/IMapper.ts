import { Class, Count } from "../validate";

export interface IClassMapper {
    toGetClassesResponse(classes: Class[]): Class[];
    toGetClassResponse(c: Class): Class;
    toGetTotalClassesResponse(total: number): Count;
}
