import { IModelMetaData, ISubModelMetaData } from "../common/Models";

export interface IModelMeta {
    GetModels(): Promise<Array<IModelMetaData>>
    GetSubModels(): Promise<Array<ISubModelMetaData>>
}