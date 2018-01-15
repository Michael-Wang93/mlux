import { Server as DashboardServer } from '../../server/dashboard'
import { IDashboard, IView } from "../../models/window";
import View from '../../view/goods/dashboard'
import { Server as ApplicationServer } from '../../server/application'

@DashboardServer.Dashboard.Registe
export class GoodsInDashboard implements IDashboard {
    Render(): IView {
        return View({});
    }
    OnClick(): void {
        ApplicationServer.Application.Open(`GoodsList`);
    }
}