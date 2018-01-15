import { WindowViewIniter } from "../../widgets/appwraper";
import { TaskManager } from '../../widgets/taskmanager'
import { IWindowHander, IView, ITask, IDashboard } from "../../models/window";
import { IModelMetaData } from "../../../../common/Models";
import { BehaviorSubject } from 'rxjs'


export interface IInitViewProps {
    BackgroundColor?: string
    Title?: string
    Icon?: string
}

let RegisterSignalKey = Symbol('RegisterSignalKey');

export let RegisterSignal = (target: any, key: string) => {
    Reflect.defineMetadata(RegisterSignalKey, true , target, key);
}

export abstract class WindowHander implements IWindowHander{
    
    public taskManager = TaskManager

    public BackgroundColor:string

    public Title:string

    public Icon: string

    public IsActive$: BehaviorSubject<boolean>

    public Zindex$: BehaviorSubject<number>

    public Opacity$: BehaviorSubject<number>

    private id: string

    private view: IView

    public MetaData: IModelMetaData

    public Width = 'auto'

    public Height = 'auto'

    public Left:number;
    
    public Top:number;

    public Resize = 'both'

    public Ext:any

    private parentId: string

    constructor(task:ITask){
        this.MetaData = task.Application.ModelMetaData;
        this.id = task.Id;
        this.Icon = task.Icon;
        this.Ext = task.Ext;
        this.parentId = task.ParentId;
        this.IsActive$ = new BehaviorSubject(task.Active);
        this.Zindex$ = new BehaviorSubject(10000);
        this.Opacity$ = new BehaviorSubject(1);
    }

    public get Id(){
        return this.id;
    }

    public get ParentId(){
        return this.parentId;
    }

    public InvokeSignalHandler(name:string,argument:Array<any>){
        let handler = Reflect.getMetadata(RegisterSignalKey, this, name);
        let me:any = this;
        if(handler && me[name]){
            me[name](...argument);
        } 
    }


    public async abstract InitView(): Promise<IView>

    async Render(): Promise<IView> {
        return WindowViewIniter({
            Id:this.id,
            Width: this.Width,
            Height: this.Height,
            Resize: this.Resize,
            Active$: this.IsActive$,
            BackgroundColor: this.BackgroundColor,
            Zindex$: this.Zindex$,
            Opacity$: this.Opacity$,
            Title: this.Title,
            Close: this.taskManager.Close,
            Switch: this.taskManager.Switch,
            Icon: this.Icon,
            Left: this.Left,
            Top: this.Top,
            Minsize: this.taskManager.Minsize,
            ContentView: await this.InitView()
        });
    }
    CloseSelf(){
        this.taskManager.Close(this.Id);
    }

    Close(): boolean {
        return true;
    }
    Minsize(): void {
        this.IsActive$.next(false);
    }
    Active(zindex:number): void {
        this.IsActive$.next(true);
        this.Zindex$.next(zindex);
    }
    Opacity(opacity:number): void {
        this.Opacity$.next(opacity);
    }
}

