import View from '../view/taskmanager'
import * as uuid from "uuid";
import { IWindowHander, ITask, IView, IWindowView } from "../models/window";
import { BehaviorSubject } from "rxjs";


export interface ITaskManagerProp {
    BackgroundColor?: string
}

export class TaskManager {
    private static ZindexQueue: Array<string> = [];

    private static Tasks: Map<string, ITask>

    private static BackgroundColor: string

    private static Views:Array<IView> = []

    public static Views$: BehaviorSubject<Array<IView>> = new  BehaviorSubject<Array<IView>>([])

    private static Tasks$: BehaviorSubject<Map<string, ITask>> = new  BehaviorSubject<Map<string, ITask>>(null);
    
    constructor(param: ITaskManagerProp = {}) {
        TaskManager.BackgroundColor = param.BackgroundColor;
        TaskManager.Tasks = new Map();
    }

    static async Add(task: ITask) {
        task.Id = uuid.v1();
        TaskManager.setAllOpacity();
        TaskManager.Tasks.set(task.Id, task);
        let instance = new task.TaskHandler(task);
        task.TaskHandlerInstance = instance;
        TaskManager.Views.push(await task.TaskHandlerInstance.Render());
        TaskManager.Views$.next(TaskManager.Views);
        TaskManager.ZindexQueue.push(task.Id);
        TaskManager.ResetIndex();
    }

    private static setAllOpacity(){
        TaskManager.Tasks.forEach((x:ITask)=>{
            x.Active = false;
            x.TaskHandlerInstance.Opacity(0.75);
        })
    }

    static Close(id: string) {
        let close = TaskManager.Tasks.get(id).TaskHandlerInstance.Close();
        if(close){
            TaskManager.Tasks.delete(id);
            TaskManager.Views = TaskManager.Views.filter((x:IWindowView & {props:any})=>{
                return x.props.Id !== id;
            })
            let index = TaskManager.ZindexQueue.findIndex((x)=>{
                return x === id;
            })
            TaskManager.ZindexQueue.splice(index,1);
            TaskManager.ResetIndex();
            TaskManager.Views$.next(TaskManager.Views);
        }
    }

    static SendSignal(id:string, name:string, argument: Array<any>){
        let ins = this.Tasks.get(id);
        if(ins){
            ins.TaskHandlerInstance.InvokeSignalHandler(name, argument);
        }
    }

    static Active(id: string) {
        TaskManager.Tasks.forEach((v: ITask, k: string) => {
            if (k === id) {
                v.Active = true;
                v.TaskHandlerInstance.Opacity(1);
            } else {
                v.Active = false;
                v.TaskHandlerInstance.Opacity(0.75);
            }
        })
        if(TaskManager.ZindexQueue.indexOf(id) === -1){
            TaskManager.ZindexQueue.push(id);
        }else{
            let index = TaskManager.ZindexQueue.findIndex((x)=>{
                return x === id;
            })
            let theone = TaskManager.ZindexQueue.splice(index,1);
            TaskManager.ZindexQueue.push(theone[0]);
        }
        TaskManager.ResetIndex();
    }

    static Switch(id: string) {
        if(TaskManager.ZindexQueue[TaskManager.ZindexQueue.length-1] === id){
            return;
        }
        TaskManager.Tasks.forEach((v: ITask, k: string) => {
            if (k === id) {
                v.Active = true;
                v.TaskHandlerInstance.Opacity(1);
            } else {
                v.Active = false;
                v.TaskHandlerInstance.Opacity(0.75);
            }
        })
        let index = TaskManager.ZindexQueue.findIndex((x)=>{
            return x === id;
        })
        let theone = TaskManager.ZindexQueue.splice(index,1);
        TaskManager.ZindexQueue.push(theone[0]);
        TaskManager.ResetIndex();
    }

    private static ResetIndex(){
        TaskManager.ZindexQueue.forEach((x,y)=>{
            TaskManager.Tasks.get(x).TaskHandlerInstance.Active(100+y);
        })
        let top = TaskManager.ZindexQueue[TaskManager.ZindexQueue.length-1];
        if(top){
            TaskManager.Tasks.get(top).Active = true;
            TaskManager.Tasks.get(top).TaskHandlerInstance.Opacity(1);
        }
        TaskManager.Tasks$.next(TaskManager.Tasks);
    }

    static Minsize(id: string) {
        TaskManager.Tasks.get(id).TaskHandlerInstance.Minsize();
        TaskManager.Tasks.get(id).Active = false;
        let index = TaskManager.ZindexQueue.findIndex((x)=>{
            return x === id;
        })
        TaskManager.ZindexQueue.splice(index,1);
        TaskManager.ResetIndex();
    }

    Render() {
        return View({
            Tasks$: TaskManager.Tasks$,
            OnClickItem: TaskManager.Active
        });
    }
}
