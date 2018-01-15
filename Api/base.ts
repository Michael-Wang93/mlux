import * as express from 'express';
import {Response} from 'express/lib/response';
import {Request} from 'express/lib/request';
import {BaseController} from '../Controllers/BaseController';
import {ServerRegister} from '../register'
import * as appView from '../View/app/app'
import { AuthorizeTypeEnum, Authorize, AuthorizeForClass } from '../Interface/IAuthorize';
import "reflect-metadata";
import {Template as AppTpl} from '../View/app/app'
import { IAbility } from "../Interface/IAbility";
import { Alibity } from '../Server/Ability';
import { IModel, IModelMetaData } from "../common/Models";

@AuthorizeForClass(AuthorizeTypeEnum.Login)
export class Base extends BaseController 
    implements IAbility.IAddAble<IModelMetaData,IModel>,
            IAbility.IDetailAble<IModelMetaData,IModel>,
            IAbility.IListAble<IModelMetaData,IModel>,
            IAbility.IDeleteAble<IModelMetaData>,
            IAbility.IAdd<IModelMetaData,any>,
            IAbility.IList<IModelMetaData,any>,
            IAbility.IDelete<IModelMetaData>,
            IAbility.IDetail<IModelMetaData,any>
{
    public AddServer:IAbility.IAdd<IModelMetaData,IModel>;

    public DetailServer:IAbility.IDetail<IModelMetaData,IModel>

    public ListServer:IAbility.IList<IModelMetaData,IModel>;

    public DeleteServer:IAbility.IDelete<IModelMetaData>

    constructor(request:Request, response:Response, model = null){
        super(request,response);
        this.AddServer = new Alibity.AddServer<IModelMetaData,IModel>(model);
        this.DetailServer = new Alibity.DetailServer<IModelMetaData,IModel>(model);
        this.ListServer = new Alibity.ListServer<IModelMetaData,IModel>(model);
        this.DeleteServer = new Alibity.DeleteServer<IModelMetaData>(model);
    }

    async Get(id:number):Promise<IModel>{
        return await this.DetailServer.Get(id);
    };

    async List(query:Object){
        return await this.ListServer.List(query);
    };

    async Delete(id:number){
        return await this.DeleteServer.Delete(id);
    };

    async Add(doc:IModel){
        return await this.AddServer.Add(doc);
    };

    async Update(id:string, query:{}, doc:IModel){
        return await this.AddServer.Update(id, query, doc);
    };
}