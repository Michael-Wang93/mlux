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
import { CustomObject as CustomObjectModel, IModel, IModelMetaData, Models } from '../common/Models';

@AuthorizeForClass(AuthorizeTypeEnum.Login)
export class CustomObject extends BaseController 
    implements 
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
        let customObject =  CustomObjectModel.GetMetaData();
        this.AddServer = new Alibity.AddServer<IModelMetaData,IModel>(customObject);
        this.DetailServer = new Alibity.DetailServer<IModelMetaData,IModel>(customObject);
        this.ListServer = new Alibity.ListServer<IModelMetaData,IModel>(customObject);
        this.DeleteServer = new Alibity.DeleteServer<IModelMetaData>(customObject);
    }

    async Get(id:number):Promise<IModel>{
        return await this.DetailServer.Get(id);
    };

    async List(query:Object){
        return await this.ListServer.List(query);
    };

    async Update(id:string, query:{}, doc:IModel){
        return await this.AddServer.Update(id, query, doc);
    };
    
    async Delete(id:number){
        return await this.DeleteServer.Delete(id);
    };

    async Add(doc:CustomObjectModel){
        return await this.AddServer.Add(doc);
    };
}