import View from '../view/menu'
import * as uuid from "uuid";
import { BehaviorSubject } from 'rxjs'
import { IModelMetaData } from "../../../common/Models";
import { Server } from '../server/application'
import { IApplication, IApplicationGroup } from "../models/window";


export interface IMenuProp{
    BackgroundColor?: string
    Applications$:BehaviorSubject<Array<IApplication>>
    OnClick(app:IApplication):void
    ApplicationGroup: Array<IApplicationGroup>
}


export default class Menu{
    private static Applications$:BehaviorSubject<Array<IApplication>>

    private static BackgroundColor: string

    private static OnAppClick: {(app:IApplication):void}

    private static IsOpen$ = new BehaviorSubject<boolean>(false);

    private static ApplicationGroup:Array<IApplicationGroup> = [];

    constructor(param:IMenuProp){
        Menu.BackgroundColor = param.BackgroundColor;
        Menu.Applications$ = param.Applications$;
        Menu.OnAppClick = param.OnClick;
        Menu.ApplicationGroup = param.ApplicationGroup;
    }

    static OnClick(app:IApplication){
        Menu.Hide();
        Menu.OnAppClick(app);
    }

    static Hide(){
        Menu.IsOpen$.next(false);
    }

    static Show(){
        Menu.IsOpen$.next(true);
    }

    static Toggle(){
        Menu.IsOpen$.next(!Menu.IsOpen$.value);
    }

    Render(){
        return View({
            Applications$: Menu.Applications$,
            OnClick: Menu.OnClick,
            IsOpen$: Menu.IsOpen$,
            ApplicationGroup: Menu.ApplicationGroup
        });
    }
}
