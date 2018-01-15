import {InitData} from './window'
import { ILoginModel } from '../models/login'
import { fetch$ } from './ajax'
import { User as UserModel, IModelMetaData } from '../../../common/Models'
import { BehaviorSubject } from 'rxjs'
import { IWindowHander } from "../models/window";
import { TaskManager } from "../widgets/taskmanager";
import { ITask, IApplication, IWindowHanderConstructor, IApplicationGroup } from '../models/window'

export namespace Server{

    export class Application{

        static RegisterOpenCommandControllers: Map<string,Array<IWindowHanderConstructor>> = new Map();

        static Applications:Array<IApplication> = [];
        
        public  static ApplicationGroup:Array<IApplicationGroup> = [];

        public static Applications$:BehaviorSubject<Array<IApplication>> = new BehaviorSubject<Array<IApplication>>(Application.Applications);

        static Open(command:string, parentId?:string,ext?:any){
            let app = Application.Applications.find((x)=>{
                return x.Command === command
            })
            Application.OpenByApplication(app,parentId,ext);
        }

        static GetTableMetaData(collectionName:string){
            return InitData.Models.find((x)=>{
                return x.CollectionName === collectionName;
            })
        }

        static GetSubTableMetaData(subModelName:string){
            return InitData.SubModels.find((x)=>{
                return x.Name === subModelName;
            })
        }

        static Append(item:IApplication){
            Application.Applications.push(item);
            Application.Applications$.next(Application.Applications);
        }

        static OpenByApplication(app:IApplication, parentId?:string, ext?:any){
            if(!app){
                return;
            }
            let command = app.Command;
            let targets:Array<IWindowHanderConstructor> = Application.RegisterOpenCommandControllers.get(command);
            for(let i of targets){
                let task = {
                    Active: true,
                    Minsize: false,
                    Title: app.Name,
                    Order: 0,
                    Icon: app.IconName,
                    IconColor: app.IconColor,
                    TaskHandler: i,
                    ParentId: parentId,
                    Application: app,
                    Ext: ext
                }
                TaskManager.Add(task);
            }
        }

        static RegisterApplicationGroup(app:IApplicationGroup){
            this.ApplicationGroup.push(app);
        }

        static RegisterApplication(app:IApplication){
            Application.Append(app);
            return (target:IWindowHanderConstructor) => {
                let targets:Array<IWindowHanderConstructor> = Application.RegisterOpenCommandControllers.get(app.Command) || [];
                Application.RegisterOpenCommandControllers.set(app.Command, targets.concat(target));
            }
        }
    }
}