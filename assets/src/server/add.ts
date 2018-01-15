import { fetch$, Asyncfetch, Sync } from './ajax'
import { Observable } from "rxjs";
import { InitData } from './window'
import { IFieldMeta } from "../../../common/Field";
import { Server as ApplicationServer } from './application'
import { AddConfig as AddConfigModel, AddConfigItem } from '../../../common/Models'
import { BehaviorSubject } from 'rxjs'

export namespace Server {
    export async function UpdateTo<T>(collection:string, id:string, query:any, data:any){
        let type = typeof data;
        return await Sync<T>(collection, 'Update', [id, query, data])
    }

    export interface IAddItem extends IFieldMeta {
        Required: boolean
        Default: any
        Display: boolean
    }

    export class AddConfig {
        constructor(public appName: string) {

        }

        public GetQuery() {
            return { AppName: this.appName };
        }

        public async Fetch(): Promise<{ [key: string]: Array<AddConfigModel> }> {
            return await Asyncfetch('AddConfig', 'ListWithDefault', [this.GetQuery()])
        }

        public GetFields(): Array<IFieldMeta> {
            let tabmeta = ApplicationServer.Application.GetTableMetaData(this.appName);
            return tabmeta.Fields;
        }

        public async GetConfigItem() {
            let config =  await this.Fetch();
            if (!config || !config.Default || !config.Custom) {
                return [];
            }
            let _config = config.Custom;
            if (!_config || !_config.length) {
                _config = config.Default || [];
            }
            let configmeta = _config[0].Config;
            return configmeta;
        }
    }

    export interface IAddConfig{
        GetFields(): IFieldMeta[]
        GetConfigItem(): Promise<AddConfigItem[]>
    }

    export class AddConfigFromPath {
        constructor(public appName: string, public Path:string[]) {

        }

        public GetQuery() {
            return { AppName: this.appName };
        }

        public async Fetch(): Promise<{ [key: string]: Array<AddConfigModel> }> {
            return await Asyncfetch('AddConfig', 'ListWithDefault', [this.GetQuery()])
        }

        public GetFields(): Array<IFieldMeta> {
            let tabmeta = ApplicationServer.Application.GetTableMetaData(this.appName);
            let ret:IFieldMeta;
            let temp:IFieldMeta[] = tabmeta.Fields;
            for(let i of this.Path){
                ret = temp.find((x:any)=>{
                    return x.Name === i;
                })
                temp = tabmeta.Fields;
            }
            if(ret.Childable){
                return ret.Children.Fields
            }
            if(ret.Iterable){
                return ret.IterType.Fields
            }
            return [ret];
        }

        public async GetConfigItem() {
            let conf =  await this.Fetch();
            let config =  await this.Fetch();
            if (!config || !config.Default || !config.Custom) {
                return [];
            }
            let _config = config.Custom;
            if (!_config || !_config.length) {
                _config = config.Default || [];
            }
            let configmeta = _config[0].Config;
            return this.InitPath(configmeta);
        }

        private InitPath(config:AddConfigItem[]){
            let ret;
            let temp;
            for(let x of this.Path){
                ret = config.find((y:any)=>{
                    return y.Name === x;
                })
                temp = ret.Meta;
            }
            return ret.Meta;
        }
    }

    export class Add<T> {

        constructor(private AddConfig: IAddConfig, private data$?:BehaviorSubject<T>) {

        }

        private InitAddItem(fields: IAddItem[], config: AddConfigItem[]) {
            for (let x of fields) {
                let fieldconfig = config.find((y) => {
                    return x.Name === y.Name;
                })
                if(!fieldconfig){
                    x.Display = false;
                    continue;
                }
                x.Required = fieldconfig.Required;
                x.Default = fieldconfig.Default;
                if (x.Childable && x.Children && x.Children.Fields) {
                    this.InitAddItem(x.Children.Fields as IAddItem[], fieldconfig.Meta)
                }
            }
        }

        async GetAddItem(): Promise<Array<IAddItem>> {
            let configmeta = await this.AddConfig.GetConfigItem();
            let fields = this.AddConfig.GetFields();
            let ret = fields as IAddItem[];
            this.InitAddItem(ret, configmeta);
            return ret;
        }

        GetData$(): BehaviorSubject<T> {
            return this.data$;
        }
    }
}