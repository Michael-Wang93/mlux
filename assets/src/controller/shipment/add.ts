import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Shipment } from "../../../../common/Models";

let metaData = ApplicationServer.Application.GetTableMetaData('Shipment');

@ApplicationServer.Application.RegisterApplication({
    Group: 'Shipment',
    Order: 1,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '添加',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "ShipmentAdd",
    ModelMetaData: metaData
})
export class ShipmentController extends ControllerServer.AddController<Shipment> {
    public Width = '500px';

    public Height = '600px';

    public Resize = 'both';
}