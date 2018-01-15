import {InitData} from './window'
import { fetch$, Asyncfetch } from './ajax'
import { User as UserModel, IModelMetaData } from '../../../common/Models'
import { BehaviorSubject } from 'rxjs'
import { IWindowHander } from "../models/window";
import { DashboardManager } from "../widgets/dashboard";
import { TaskManager } from "../widgets/taskmanager";
import { Server as appServer } from "./application";
import { IDashboard, IWindowHanderConstructor } from '../models/window'
import Message from "../widgets/message";

export namespace Server{
    export interface IExcelImportParam{
        File: string,
        Model: string,
        Names: string[]
    }
    export class ExcelImport{
        private static ImportAbleModel: IModelMetaData[] = [];

        static RegisterImportAble(model:IModelMetaData){
            ExcelImport.ImportAbleModel.push(model);
        }

        static GetImportAbleModels(){
            return ExcelImport.ImportAbleModel;
        }
        
        static Import(value:IExcelImportParam){
            Asyncfetch('ExcelImport', 'Add', [value.Model, value.Names, value.File]).then(()=>{
                Message.Show({
                    Type: 'success',
                    Content: '已经开始导入，请一段时间后确认导入结果'
                })
            })
        }
    }
}