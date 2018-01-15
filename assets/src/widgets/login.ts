import View from '../view/login'
import { ILoginModel } from "../models/login";
import { Server } from '../server/user'


export default class Login {
    Submit(loginModel: ILoginModel) {
        Server.User.Login(loginModel);
    }
    public Render() {
        return View({
            Submit: this.Submit
        });
    }
}
