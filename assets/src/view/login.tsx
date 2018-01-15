import { View } from "./base";
import { CSSProperties } from "react";
import {ILoginModel} from '../models/login'
import * as React from "react";
import { Input,Button } from "antd";

interface ILoginProps {
    Submit(loginModel:ILoginModel): void
}

interface ILoginState {
    loginModel:ILoginModel
}

class LoginView extends View<ILoginProps, ILoginState>{
    constructor(props:ILoginProps) {
        super(props);
        this.state = {loginModel:{Account:'', Password:''}};
    }

     getStyles = ()=> {
        return {
            container:{
                display: 'flex',
                alignItems: 'center',
                width:"100%",
                height:"100%",
                overflow: "hidden",
                justifyContent: 'center'
            } as CSSProperties,
            paper:{
                width:"100%",
                opacity: 0.9,
                display:'flex',
                justifyContent: 'center',
                padding: 16
            } as CSSProperties,
            login:{
                opacity: 0.97,
                display:'flex',
                flexDirection: 'column'
            } as CSSProperties
        }  
    }

    onAccountChange(val:string){
        this.setState({loginModel:{Account: val, Password: this.state.loginModel.Password}})
    }

    onPasswordChange(val:string){
        this.setState({loginModel:{Account: this.state.loginModel.Account, Password: val}})
    }

    render() {
        return <div style={this.getStyles().container}>
            <div style={this.getStyles().paper}>
                <form style={this.getStyles().login}>
                    <div style={{padding:2}}>
                    <Input
                        onChange={(e)=>{this.onAccountChange(e.target.value)}}  
                        value={this.state.loginModel.Account}
                    />
                    </div>
                    <div style={{padding:2}}>
                    <Input
                        type="password"
                        onChange={(e)=>{this.onPasswordChange(e.target.value)}}    
                        value={this.state.loginModel.Password}
                    />
                    </div>
                    <div style={{padding:2}}>
                        <Button type="primary" onClick={()=>{ this.state && this.props.Submit(this.state.loginModel)}} style={{display:'flex',justifyContent:'center', width:'100%'}} >登录</Button>
                    </div>
                </form>
            </div>
        </div>;
    }
}

export default function(param:ILoginProps){
    return <LoginView {...param}/>
}

