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
import { Attachment as AttachmentModel, IModel, IModelMetaData, Models, SubAttachment } from '../common/Models';
import * as fs from 'fs'

@AuthorizeForClass(AuthorizeTypeEnum.Login)
export class Attachment extends BaseController 
    implements 
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
        let attachment =  AttachmentModel.GetMetaData();
        this.AddServer = new Alibity.AddServer<IModelMetaData,IModel>(attachment);
        this.DetailServer = new Alibity.DetailServer<IModelMetaData,IModel>(attachment);
        this.ListServer = new Alibity.ListServer<IModelMetaData,IModel>(attachment);
        this.DeleteServer = new Alibity.DeleteServer<IModelMetaData>(attachment);
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

    async Upload(files:any){
        if(files && files[0]){
            let x = files[0];
            let attachment =  new SubAttachment();
            attachment.Path = x.path;
            attachment.OriginName = x.originalname;
            attachment.MimeType = x.mimetype;
            attachment.FileName = x.filename;
            return attachment;
        }
        return null;
    };

    async PreviewAvatar(path:any){
        if(path && fs.existsSync(`./${path}`)){
            this.Response.sendfile(path);
        }
    };

    async Add(doc:any, files:any){
        if(!doc.FileName || !doc.Type){
            return null;
        }
        let filename = `${process.execPath}\attachment\${doc.FileName}`;
        try{
            fs.writeFileSync(filename,files);
            return await this.AddServer.Add(doc);
        }catch(error){
            return null;
        }
    };
}