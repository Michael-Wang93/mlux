import {InitData} from './window'
import { ILoginModel } from '../models/login'
import { fetch$ } from './ajax'
import { User as UserModel } from '../../../common/Models'
import { BehaviorSubject } from 'rxjs'

export namespace Server{
    export class User{
        public static CurrentUser:BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(InitData.User);

        public static Login(para:ILoginModel){
            fetch$('User', 'Login', [para.Account, para.Password]).subscribe((res:any)=>{
                if(res.status && res.user){
                    User.CurrentUser.next(res.user);
                }
            })
        }
    }
}