import { Setting, IModelMetaData, User, ISubModelMetaData } from "./Models";
import { List } from "immutable";

export interface IInitData {
    Models: Array<IModelMetaData>,
    SubModels: Array<ISubModelMetaData>,
    Setting: Setting,
    Tasks?: Array<TaskModel>,
    User: User
}

export interface IQuery{
    SearchObject: {},
}

export interface TaskModel {
    Model:IModelMetaData    
    Query: IQuery;
    ViewType: string;
    Draging: boolean;
    WindowId: string;
    Ext: any;
    Position: {left:number, top:number};
    MouseDownPosition: {left:number, top:number};
}

export interface IAjax {
    Collection: string;
    Action: string;
    Arguments: Array<any>;
}

export var DescriptionKey = Symbol('DescriptionKey');
export var Description = (description:string) => {
    return (target:any, key:any)=> {
        Reflect.defineMetadata(DescriptionKey,description,target,key);
        
    }
}
