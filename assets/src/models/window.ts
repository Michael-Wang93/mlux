import { IModelMetaData, Setting, User, ISubModelMetaData } from "../../../common/Models";
import { IFieldMeta } from "../../../common/Field";
import { BehaviorSubject } from 'rxjs'
export interface IWindow extends Window {
    InitData:{
        Models: Array<IModelMetaData>,
        SubModels: Array<ISubModelMetaData>,
        Setting: Setting,
        User: User
    } 
}

export interface IView{
    
}


export interface IWindowContext{
    WindowId:string
}

export interface IWindowView extends IView{
     Id: string
}

export interface IApplicationGroup{
    Group: string
    Name: string
    Order: number
    IconName: string
    IconColor: string
}

export interface IApplication{
    AppName?: string
    Group?: string
    Order?: number
    Name?: string
    IconName?: string
    IconColor?: string
    ShowType: 'Quick' | 'List' | 'None'
    Command: string
    ModelMetaData?:IModelMetaData | ISubModelMetaData
}

export interface IApplicationGroup{
    Name: string
    IconName: string
    IconColor: string
    Order: number
}

export interface ITask {
    Active: boolean
    Minsize: boolean
    Title: string
    Order: number
    Icon: string
    IconColor: string
    Id?: string
    Ext?: any
    ParentId?: string
    Application: IApplication
    TaskHandler: IWindowHanderConstructor
    TaskHandlerInstance?: IWindowHander
}

export interface IDashboard {
    Render():IView
    OnClick():void
}

export interface IWindowHanderConstructor{
    new (value: ITask): IWindowHander;
}

export interface IWindowHander {
    Id:string
    Close():boolean;
    Render():Promise<IView>;
    InitView(): Promise<IView>;
    Minsize():void;
    Active(zindex:number):void
    Opacity(opacity:number):void
    InvokeSignalHandler(name:string,argument:Array<any>):void
}

export interface IMessage{
    Type: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'loading' | 'destroy'
    Content: any
    OnClose?():void
    Duration?:number
}

export interface IAddHandler<T>{
    Record: T
    AppName: string
    Path: string[]
    ID?: string
}

export interface IListHandler<T>{
    Record: BehaviorSubject<T[]>
    AppName: string
    Path: string[]
    Meta: IFieldMeta
}