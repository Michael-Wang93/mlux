import View from '../view/dashboard'
import { Server } from '../server/dashboard'


export class Dashboard {

    constructor(public DashboardServer: typeof Server.DashBoard) {

    }

    Render() {
        return View({
            Dashboards$: this.DashboardServer.Dashboards$
        });
    }
}