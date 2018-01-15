import { TaskManager } from '../widgets/taskmanager'

export namespace Server{
    export class Task{
        public static SendSignal(id:string, name:string, argument: Array<any>){
            TaskManager.SendSignal(id,name,argument);
        }
    }
}