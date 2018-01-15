import {layoutTemplate} from '../layout'
import { ITemplate } from '../../Interface/IErp'
import { IInitData } from "../../common/erp";

export class Template implements ITemplate{
    public Head:string;

    public Content:string;

    public Script:IInitData;

    public Layput:string;
    
    constructor(script:IInitData = null, head:string = '', content:string = '', layout:string = layoutTemplate){
        this.Head = head;
        this.Content = content;
        this.Script = script;
        this.Layput  = layout;
    }

    public init(){
        return this.Layput.replace('{head}',this.Head).replace('{content}',this.Content).replace('{script}',JSON.stringify(this.Script));
    }
}
