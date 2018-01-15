import { Server as ApplicationServer } from '../../server/application'
import { Server as DashboardServer } from '../../server/dashboard'
import { Server as ExcelImportServer } from '../../server/excelimport'
import { Server as AddServer } from '../../server/add'
import { Note, Goods } from "../../../../common/Models";
import { Controller as ControllerServer } from '../base/list/main'
import { RegisterSignal } from "../base/base";
import { ActionsInTable} from './action'
import * as uuid from 'uuid'

let metaData = ApplicationServer.Application.GetTableMetaData('Goods');

ExcelImportServer.ExcelImport.RegisterImportAble(metaData);

ApplicationServer.Application.RegisterApplicationGroup({
    Group: 'Goods',
    Name: '商品',
    IconColor: '',
    Order: 2,
    IconName: 'solution'
});

@ApplicationServer.Application.RegisterApplication({
    Group: 'Goods',
    Order: 0,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '列表',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "GoodsList",
    ModelMetaData: metaData
})
export class GoodsController extends ControllerServer.ListController {
    public Width = '500px';

    public Height = '500px';
    
    public Resize = 'both';

    public ActionsInTable = ActionsInTable(this.MetaData)

    @RegisterSignal
    public async AddNote(data:Note, record:Goods) {
        data.ID = uuid.v1();
        let datatosync = {
            $addToSet:{
                "Note": data
            }
        }
        await AddServer.UpdateTo<string>('Goods',record._id, {}, datatosync);
        this.TableServer.Reload()
    }

    @RegisterSignal
    public async EditNote(data:Note, record:Goods) {
        let query = {
            Note :{$elemMatch:{ID:data.ID}} 
        }
        let datatosync = {$set: {'Note.$': data}};
        await AddServer.UpdateTo<string>('Goods',record._id, query, datatosync);
        this.TableServer.Reload()
    }
}