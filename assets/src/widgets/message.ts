import { Show, Destory } from '../view/message'
import { Server } from '../server/search'
import { IMessage } from "../models/window";


export default class Message {

    public static Show(message:IMessage){
        Show(message);
    }

    public static Destory(){
        Destory();
    }
}