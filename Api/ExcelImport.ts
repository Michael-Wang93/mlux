import * as express from 'express';
import {Response} from 'express';
import {Request} from 'express';
import {BaseController} from '../Controllers/BaseController';
import "reflect-metadata";
import { Authorize } from "../Server/Authorize";
import { User as UserModel, IModelMetaData, IModel } from '../common/Models'
import { Attachment } from "./Attachment";
import { Attachment as AttachmentModel } from '../common/Models'
import * as fs from 'fs'
import { code } from "../initData";
import { exec } from 'child_process'

export class ExcelImport extends BaseController
{
    constructor(request:Request, response:Response){
        super(request,response);
    }

    async Add(model:string, fields:string[],files:AttachmentModel[]){
        let att = files[0];
        let cmd = `mongoimport --db ${code} --collection ${ model } --type csv --ignoreBlanks --fields ${ fields.join(',') } --file ${att.Path}`
        exec(cmd, (data, stdout, stderr) => {
            if(data){
                console.log(data.message);
            }
            if(stdout){
                console.log(stdout);
            }
            if(stderr){
                console.log(stderr);
            }
        });
    };
}