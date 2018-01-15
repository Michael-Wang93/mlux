import View from '../view/table/main'
import { Server } from '../server/table'


export default class Table {
    constructor(public TableServer:Server.Table){
    }

    public async Render() {
        return View({
            OnSave: this.TableServer.OnSave,
            Opetations: this.TableServer.GetOperations(),
            Columns: await this.TableServer.GetColumns(),
            Data$: await this.TableServer.GetData$(),
            RowSelection: await this.TableServer.GetRowSelection(),
            ModelMeta: this.TableServer.Model
        });
    }
}