import { ActionConfig as ActionConfigModel } from '../../../common/Models'
import { fetch$, Asyncfetch } from './ajax'
import { Observable } from "rxjs";
import { Server as ApplicationServer } from './application'
import { Server as TaskServer } from './taskmanager'
import { EnumActionType } from "../../../common/Enum";



export namespace Server{
    export interface IActionItem{
        IconClassName:string
        ButtonName:string
        Code(context:IActionContext,item:any,windowId:string,parentId:string):void
        Order:number
        Type: string
        Name:string
    }

    export interface IActionInvoke extends IActionItem{
        Invoke(data:any):void
    }

    export interface IActionContext {
        ApplicationServer: typeof ApplicationServer
        fetch$: {(collection:string, action:string, args?: Array<any>):any},
        Asyncfetch: {(collection:string, action:string, args?: Array<any>):Promise<any>},
        TaskServer: typeof TaskServer
    }

    export let ActionContext:IActionContext = {
        ApplicationServer: ApplicationServer,
        fetch$: fetch$,
        Asyncfetch: Asyncfetch,
        TaskServer: TaskServer
    }

    export class ActionConfig{
        constructor(public AppName:string, public Qurery?:{}){

        }

        public GetQuery(){
            return this.Qurery || {AppName:this.AppName};
        }

        public async Fetch(): Promise<Array<ActionConfigModel>>{
            return await Asyncfetch('ActionConfig', 'List', [this.GetQuery()])
        }

        public async GetConfigItem(){
            return await this.Fetch();
        }
    }

    export class Action{

        constructor(private actionconfig:ActionConfig,private  windowId:string,private parentId?:string){
        }

        private codeWithContext(code:{(context:IActionContext,item:any,id:string,parentId?:string):void}){
            return (item:any)=>{
                code(ActionContext,item,this.windowId,this.parentId);
            }
        }

        public async GetActions(actions:Array<IActionItem>):Promise<Array< IActionInvoke >>{
            let items = await this.actionconfig .GetConfigItem();
            for(let x of actions){
                let conf = items.find((y)=>{
                    return y.Name === x.Name && y.IsBuildin;
                });
                if(conf){
                    x.ButtonName = conf.ButtonName ? conf.ButtonName : x.ButtonName;
                    x.Code  = conf.Code ? eval(conf.Code) : x.Code;
                    x.IconClassName = conf.IconClassName ? conf.IconClassName : x.IconClassName;
                    x.Order = conf.Order ? conf.Order : x.Order;
                }
            }
            let customaction = items.filter((x)=>{
                return !x.IsBuildin
            }).map(y=>{
                return {
                    IconClassName:y.IconClassName,
                    ButtonName:y.ButtonName,
                    Code: eval(y.Code),
                    Order:y.Order,
                    Name:y.Name,
                    Type:y.Type
                } as IActionItem
            });
            return actions.concat(customaction).map((x: IActionInvoke )=>{
                x.Invoke = this.codeWithContext(x.Code);
                return x;
            });
        }
    }
}