import { SearchConfig as SearchItemModel, IModelMetaData } from '../../../common/Models'
import { fetch$, Asyncfetch } from './ajax'
import { Observable } from "rxjs";
import { InitData } from './window'
import { IFieldMeta } from "../../../common/Field";

export namespace Server{
    export class SearchConfig{
        constructor(public appName:string){

        }

        public GetQuery(){
            return {AppName:this.appName};
        }

        public async Fetch(): Promise<Array<SearchItemModel>>{
            return await Asyncfetch('SearchConfig', 'List', [this.GetQuery()])
        }

        public async GetConfigItem(){
            return await this.Fetch();
        }
    }

    export class SearchItem{

        constructor(public FieldMeta:IFieldMeta){
        }

        ToQueryNode(value:any){
            return {};
        }
    }

    export class Search{

        constructor(private SearchConfig:SearchConfig, private OnSetQuery:{(query:any):void}){

        }

        public async SetQuery(query:any){
            this.OnSetQuery(query);
        }

        public OnKeyWordSearch(value:string){
            this.SetQuery({KeyWord:value})
        }

        public GetSearchItem(name:string):SearchItem{
            let fieldMeta = InitData.Models.find((x:IModelMetaData)=>{
                return x.CollectionName == this.SearchConfig.appName;
            }).Fields.find((x)=>{
                return x.Name === name;
            });
            return new SearchItem(fieldMeta);
        }

        public async GetSearchItems():Promise<Array<SearchItem>>{
            let configItems = await this.SearchConfig.GetConfigItem();
            let fields = InitData.Models.find((x:IModelMetaData)=>{
                return x.CollectionName == this.SearchConfig.appName;
            }).Fields;
            return configItems.map((x)=>{
                let fieldMeta = fields.find((y)=>{
                    return y.Name === x.Name;
                })
                return new SearchItem(fieldMeta);
            })
        }
    }
}