import "reflect-metadata";
import { BaseController } from "../Controllers/BaseController";
import { Request, Response } from "express";
import { User } from "../common/Models";

export interface IAuthorize{
    AuthorizeAction(cls:BaseController,method:string,request:Request,response:Response):void
    
    AuthorizeToken(token:string):Promise<any>

    AuthorizeAccountAndPassWord(user:string, passWord:string):Promise<{token:string,user:User}>

    Registe(user:string, passWord:string):Promise<any>

    InitEncodeKey(passWord:string):string
}

export var AuthorizeTypeKey = Symbol.for('AuthorizeTypeKey');

export enum AuthorizeTypeEnum {
    Anyone,
    Login
}

export var Authorize = function(type:AuthorizeTypeEnum){
    return function(target:any, prop:any, desc:any){
        Reflect.defineMetadata(AuthorizeTypeKey,type,target[prop]);
    }
}

export var AuthorizeForClass = function(type:AuthorizeTypeEnum){
    return function(target:any){
        Reflect.defineMetadata(AuthorizeTypeKey,type,target);
    }
}

