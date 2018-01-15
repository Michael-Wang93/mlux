import { IInitData } from "../common/erp";

export interface ITemplate {
    Head:string;
    Content:string;
    Script:IInitData;
    init():string;
}

