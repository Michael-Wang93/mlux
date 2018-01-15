import View from '../view/rightclickmenu'

export interface IRightClickMenuItem<T>{
    Label: string
    Name: string
    Command: string
    Param: T
    OnSelect():void
}

export interface IRightClickMenuProp<T>{
    Items:Array<IRightClickMenuItem<T>>
    WindowId: string
}
export class RightClickMenu<T>{
    private Items:Array<IRightClickMenuItem<T>>

    private WindowId: string

    constructor(param:IRightClickMenuProp<T>){
        this.Items = param.Items;
    }

    public Render(modelName:string,id:string){
        return new View<T>({
            Items: this.Items,
            WindowId: this.WindowId
        });
    }
}