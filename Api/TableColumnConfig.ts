import * as express from 'express';
import {Response} from 'express';
import {Request} from 'express';
import {BaseController} from '../Controllers/BaseController';
import { AuthorizeTypeEnum, Authorize as AuthorizeAttribute, IAuthorize } from '../Interface/IAuthorize';
import "reflect-metadata";
import { Authorize } from "../Server/Authorize";
import { TableColumnConfig as TableColumnConfigModel, IModelMetaData, IModel } from '../common/Models'
import * as moment from 'moment'
import { IAbility } from "../Interface/IAbility";
import { Alibity } from "../Server/Ability";
import { Config } from "../InitConfig/TableColumnConfig"


export class TableColumnConfig extends BaseController
    implements 
    IAbility.IAdd<IModelMetaData,any>,
    IAbility.IList<IModelMetaData,any>,
    IAbility.IDelete<IModelMetaData>,
    IAbility.IDetail<IModelMetaData,any>
{
    Authorizer: IAuthorize;

    public AddServer:IAbility.IAdd<IModelMetaData,IModel>;
    
    public DetailServer:IAbility.IDetail<IModelMetaData,IModel>

    public ListServer:IAbility.IList<IModelMetaData,IModel>;

    public DeleteServer:IAbility.IDelete<IModelMetaData>
        
    constructor(request:Request, response:Response){
        super(request,response);
        this.Authorizer = new Authorize();
        this.AddServer = new Alibity.AddServer<IModelMetaData,IModel>(TableColumnConfigModel.GetMetaData());
        this.DetailServer = new Alibity.DetailServer<IModelMetaData,IModel>(TableColumnConfigModel.GetMetaData());
        this.ListServer = new Alibity.ListServer<IModelMetaData,IModel>(TableColumnConfigModel.GetMetaData());
        this.DeleteServer = new Alibity.DeleteServer<IModelMetaData>(TableColumnConfigModel.GetMetaData());
    }

    async Add(doc:TableColumnConfigModel){
        return await this.AddServer.Add(doc);
    };

    async Get(id:number):Promise<IModel>{
        return await this.DetailServer.Get(id);
    };

    async List(query:Object){
        return await this.ListServer.List(query);
    };

    async ListWithDefault(query:{[key:string]:any}){
        return {
            Default: Config[query.AppName],
            Custom: await this.ListServer.List(query)
        }
    };

    async Update(id:string, query:{}, doc:IModel){
        return await this.AddServer.Update(id, query, doc);
    };
    
    async Delete(id:number){
        return await this.DeleteServer.Delete(id);
    };
}