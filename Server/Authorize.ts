import { IAuthorize, AuthorizeTypeEnum, AuthorizeTypeKey } from '../Interface/IAuthorize'
import * as crypto from 'crypto'
import {BaseController} from '../Controllers/BaseController'
import {Response} from 'express';
import {Request} from 'express';
import { NoPromission } from './Exception'
import { db } from "../initData";

export class Authorize implements IAuthorize{

    public async AuthorizeAction(cls:BaseController,method:string,request:Request,response:Response){
        var token = request['cookies'] && request['cookies']['uid'];
        var user = await this.AuthorizeToken(token);
        if( Reflect.getOwnMetadata(AuthorizeTypeKey,cls) === AuthorizeTypeEnum.Login ||
                Reflect.getOwnMetadata(AuthorizeTypeKey,cls[method]) === AuthorizeTypeEnum.Login){
            if(!token){
                throw new NoPromission('No Promission!');
            }
            if(!user){
                throw new NoPromission('No Promission!');
            }
        }
        cls.User = user;
    }

    public async AuthorizeAccountAndPassWord(user:string, passWord:string){
        var users = db.collection('User');
        var theUser = await users.findOne({'Mobile':{$eq: user}, 'Password': {$eq: this.InitEncodeKey(passWord)}})
        if(theUser && theUser._id){
            var token = this.InitEncodeKey(user) + this.InitEncodeKey(passWord);
            users.updateOne({'id':{$eq:theUser.id}},{"$set": {"token":token}});
            return {token:token,user:theUser};
        }
        return null;
    }

    public async AuthorizeToken(token:string){
        var users = db.collection('User');
        var user = await users.findOne({'token': token});
        if(user && user._id){
            return  user;
        }
        return null;
    }

    public async Registe(user:string, password:string){
        var users = db.collection('User');
        var pswd = this.InitEncodeKey(password);
        var result = await users.insertOne({'Mobile': user, 'Password': pswd});
        if(result && result.result){
            return true;
        }
        return false;
    }

    public InitEncodeKey(key:string){
        var md5 = crypto.createHash('md5');
        return md5.update('theErp').update(key).digest('hex');
    }
}