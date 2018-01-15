import * as express from 'express';
import {Response} from 'express';
import {Request} from 'express';
import { IAuthorize } from '../Interface/IAuthorize';
import * as bodyPaeser from 'body-parser'
import {ServerRegister} from '../register'
import {IController} from '../Interface/IController'
import { ITemplate } from "../Interface/IErp";
import { db } from "../initData";
import { ReplaceOneOptions, UpdateWriteOpResult } from "mongodb";
import { User } from "../common/Models";

export class BaseController implements IController{
    public Request:Request;

    public SereverRegister: ServerRegister;

    public Response:Response;

    public User: User

    constructor(request:Request,response:Response){
        this.Request = request;
        this.Response = response;
        this.User = request['User'] || null;
    }

    public GetParams():{[key:string]:string}{
        return this.Request.params;
    }

    public GetQuery():{[key:string]:string}{
        return this.Request.query;
    }

    public GetCookie():{[key:string]:string}{
        return this.Request['cookie'];
    }

    public static GetConnection(){
        return db.collection(this.name);
    }

    public static Find<T>(query?: Object){
        return this.GetConnection().find<T>(query);
    }

    public static async FindOne<T>(query?: Object){
        return await this.GetConnection().findOne(query) as T;
    }

    public static UpdateOne(filter: Object, update: Object, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>{
        return this.GetConnection().updateOne(filter, update, options);
    }
}