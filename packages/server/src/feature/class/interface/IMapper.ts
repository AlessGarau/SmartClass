import { Class } from "../validate";

export interface IClassMapper {
    toGetClassesResponse(classes: Class[]): Class[];
}
