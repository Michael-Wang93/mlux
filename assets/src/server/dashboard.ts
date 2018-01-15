import { fetch$ } from './ajax'
import { IModelMetaData } from '../../../common/Models'
import { BehaviorSubject } from 'rxjs'
import { Server as appServer } from "./application";
import { IDashboard } from '../models/window'

export namespace Server{

    export class Dashboard{
        private static Dashboards:IDashboard[] = [];

        public static Dashboards$:BehaviorSubject<Array<IDashboard>> = new BehaviorSubject<Array<IDashboard>>([]);

        static Registe(app: {new(): IDashboard}){
            Dashboard.Dashboards.push(new app());
            Dashboard.Dashboards$.next(Dashboard.Dashboards);
        }
    }
}