import * as express from 'express';
import {Response} from 'express';
import {Request} from 'express';
import {BaseController} from '../Controllers/BaseController';
import { AuthorizeTypeEnum, Authorize as AuthorizeAttribute, IAuthorize } from '../Interface/IAuthorize';
import "reflect-metadata";
import { Authorize } from "../Server/Authorize";
import { User as UserModel, IModelMetaData, IModel } from '../common/Models'
import * as moment from 'moment'
import { IAbility } from "../Interface/IAbility";
import { Alibity } from "../Server/Ability";

export class User extends BaseController
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
        this.AddServer = new Alibity.AddServer<IModelMetaData,IModel>(UserModel.GetMetaData());
        this.DetailServer = new Alibity.DetailServer<IModelMetaData,IModel>(UserModel.GetMetaData());
        this.ListServer = new Alibity.ListServer<IModelMetaData,IModel>(UserModel.GetMetaData());
        this.DeleteServer = new Alibity.DeleteServer<IModelMetaData>(UserModel.GetMetaData());
    }

    async Add(doc:UserModel){
        return await this.AddServer.Add(doc);
    };

    async Get(id:number):Promise<IModel>{
        return await this.DetailServer.Get(id);
    };

    async List(query:Object){
        return await this.ListServer.List(query);
    };

    async Delete(id:number){
        return await this.DeleteServer.Delete(id);
    };

    async Update(id:string, query:{}, doc:IModel){
        return await this.AddServer.Update(id, query, doc);
    };
    
    @AuthorizeAttribute(AuthorizeTypeEnum.Anyone)
    public async Login(account, password){
        var token:any = await this.Authorizer.AuthorizeAccountAndPassWord(account,password);
        if(token){
            this.Response.cookie('uid',token.token,{
                expires: moment().add(7,'days').toDate()
            });
            delete token.user.password
            delete token.user.token
            return {status: true, user: token.user};;
        }
        return {status: false};
    }
}