import * as React from 'react'
import { message } from 'antd'
import { IMessage } from "../models/window";



export  function Show(messageparam:IMessage) {
    let _message:any = message;
    _message[messageparam.Type](messageparam.Content,messageparam.Duration, messageparam.OnClose);
}

export  function Destory(){
    message.destroy()
}