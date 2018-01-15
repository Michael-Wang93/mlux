import View from '../view/add/add'
import { Server } from "../server/add";


export class Add<T> {
    constructor(private addServer:Server.Add<T>){

    }

    public OnSubmit:{(callback:{(value:any):void}):void};

    private RegSubmit(fn:{(callback:{(value:any):void}):void}){
        this.OnSubmit = fn;
    }
    
    public GetFormData(callback:{(value:any):void}){
        this.OnSubmit(callback);
    }

    public async Render() {
        return View({
            RegSubmit: (fn:{(callback:{(value:any):void}):void})=>{this.RegSubmit(fn)},
            Items: await this.addServer.GetAddItem(),
            Data$: this.addServer.GetData$()
        });
    }
}