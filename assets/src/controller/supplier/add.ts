import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Supplier } from "../../../../common/Models";

let metaData = ApplicationServer.Application.GetTableMetaData('Supplier');

@ApplicationServer.Application.RegisterApplication({
    Group: 'Supplier',
    Order: 1,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '添加',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "SupplierAdd",
    ModelMetaData: metaData
})
export class SupplierController extends ControllerServer.AddController<Supplier> {
    public Width = '500px';

    public Height = '500px';

    public Resize = 'both';
}