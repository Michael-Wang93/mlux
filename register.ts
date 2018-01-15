import {Authorize} from './Server/Authorize'
import {IAuthorize} from './Interface/IAuthorize'
import {Response} from 'express';
import {Request} from 'express';
import { AuthorizeTypeEnum } from './Interface/IAuthorize';
import "reflect-metadata";
import {BaseController} from './Controllers/BaseController'
import {NoPromission} from './Server/Exception'

export class ServerRegister{
    public Authorizer:IAuthorize;

    public async Run(cls:BaseController,request:Request,response:Response,action:string,params:Array<any>=[]){
        this.Authorizer = new Authorize();
        try {
            await this.Authorizer.AuthorizeAction(cls,action,request,response);
        } catch (error) {
            response.send(error); 
        }
        try {
            var resp = await cls[action](...params);
        }catch(error){
            response.send(error); 
            return;
        }
        if(request.path === '/rest/api'){
            response.send({result:resp});
        }else if(resp){
            response.send(resp);
        }
    }
}