
import { IWindow } from '../models/window'

export let InitData = (window as IWindow).InitData

interface ILastClickPosition{
    X: number,
    Y: number
}

export let LastClickPosition:ILastClickPosition = {
    X:100,
    Y:100
};

export function SetLastClickPosition(position:ILastClickPosition){
    LastClickPosition = position;
}