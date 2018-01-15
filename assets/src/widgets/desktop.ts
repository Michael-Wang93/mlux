import View from '../view/desktop'
import { IView } from "../models/window";
import { BehaviorSubject } from "rxjs";
import { TaskManager } from "./taskmanager";


export class Desktop {

    public Render() {
        return View({
            Windows$: TaskManager.Views$
        });
    }
}