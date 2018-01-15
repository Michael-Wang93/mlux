import { Server as ApplicationServer } from '../../server/application'
import { Server as AddServer } from '../../server/add'
import { Note, Shipment } from "../../../../common/Models";
import { Controller as ControllerServer } from '../base/list/main'
import { RegisterSignal } from "../base/base";
import { ActionsInTable} from './action'
import * as uuid from 'uuid'

let metaData = ApplicationServer.Application.GetTableMetaData('Shipment');

ApplicationServer.Application.RegisterApplicationGroup({
    Group: 'Shipment',
    Name: '出货',
    IconColor: '',
    Order: 2,
    IconName: 'solution'
});

@ApplicationServer.Application.RegisterApplication({
    Group: 'Shipment',
    Order: 0,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '列表',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "ShipmentList",
    ModelMetaData: metaData
})
export class ShipmentController extends ControllerServer.ListController {
    public Width = '500px';

    public Height = '500px';
    
    public Resize = 'both';

    public ActionsInTable = ActionsInTable(this.MetaData)

    @RegisterSignal
    public async AddNote(data:Note, record:Shipment) {
        data.ID = uuid.v1();
        let datatosync = {
            $addToSet:{
                "Note": data
            }
        }
        await AddServer.UpdateTo<string>('Shipment',record._id, {}, datatosync);
        this.TableServer.Reload()
    }

    @RegisterSignal
    public async EditNote(data:Note, record:Shipment) {
        let query = {
            Note :{$elemMatch:{ID:data.ID}} 
        }
        let datatosync = {$set: {'Note.$': data}};
        await AddServer.UpdateTo<string>('Shipment',record._id, query, datatosync);
        this.TableServer.Reload()
    }
}