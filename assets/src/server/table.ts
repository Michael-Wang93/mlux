import { TableColumnConfig as TableColumnConfigModel, IModelMetaData } from '../../../common/Models'
import { fetch$, Asyncfetch } from './ajax'
import { Observable, BehaviorSubject } from "rxjs";
import { InitData } from './window'
import { IFieldMeta } from "../../../common/Field";
import { Server as ActionServer } from './action'

export namespace Server{
    export interface ITableColumn{
        title: string,
        dataIndex: string,
        key: string,
        render: {():any}
        Meta: IFieldMeta
        filterDropdown?: {(fieldMeta:IFieldMeta):any}
    }

    export class TableColumnConfig{
        constructor(public AppName:string){

        }

        public GetQuery(){
            return {AppName:this.AppName};
        }

        public async Fetch(): Promise<{[key: string]:Array<TableColumnConfigModel>}>{
            return await Asyncfetch('TableColumnConfig', 'ListWithDefault', [this.GetQuery()])
        }

        public async GetColumns(){
            return await this.Fetch();
        }
    }

    export class Table{
        private Query$ = new BehaviorSubject<{}>({});

        private Data$ = new BehaviorSubject<any[]>([]);
        
        constructor(
                public WindowId: string,
                public Model:IModelMetaData, 
                public TableColumnConfig:TableColumnConfig, 
                public OnMassCheck:{(rows:any):void}, 
                public AdHocMap:Map<string,Partial<ITableColumn>>=new Map(), 
                public TableActions:Array<ActionServer.IActionInvoke> = [],
                public RenderFilter:{(fieldMeta:IFieldMeta):any},
            ){
            this.Query$.subscribe((x)=>{
                Asyncfetch(this.Model.CollectionName, 'List', [x]).then((res)=>{
                    this.Data$.next(res);
                })
            })
        }

        public OnSave = (id:string,query:any,data:any) =>{
            Asyncfetch(this.Model.CollectionName, 'Update', [id,query,data]).then((res)=>{
                this.Reload();
            })
        }

        public Reload(query:{}={}){
            this.Query$.next(query);
        }

        public SetQuery(query:{}){
            this.Query$.next(query);
        }

        public GetData$():BehaviorSubject<any[]>{
            return this.Data$;
        }

        public GetRowSelection(){
            return {
                onChange: (selectedRowKeys:any, selectedRows:any)=>{
                    if(this.OnMassCheck){
                        this.OnMassCheck(selectedRows)
                    }
                },
                Meta: this.Model
            }
        }

        public GetOperations(){
            return this.TableActions;
        }

        public async GetColumns():Promise<Array<ITableColumn>>{
            let config = await this.TableColumnConfig.GetColumns();
            if(!config || !config.Default || !config.Custom){
                return [];
            }
            let _config = config.Custom;
            if(!_config || !_config.length){
                _config = config.Default || [];
            }
            return _config.map((x)=>{
                let field = this.Model.Fields.find((y)=>{
                    return y.Name === x.Name;
                })
                let ad:Partial<ITableColumn> = {};
                if(this.AdHocMap.has(x.Name)){
                    ad =  this.AdHocMap.get(x.Name);
                }
                return {
                    title: ad.title || field.Description,
                    dataIndex: ad.dataIndex ||  field.Name,
                    key: ad.dataIndex || field.Name,
                    render: ad.render,
                    Meta: field,
                    filterDropdownVisible: true,
                    filterDropdown: (ad.filterDropdown || this.RenderFilter)(field)
                }
            })
        }
    }
}