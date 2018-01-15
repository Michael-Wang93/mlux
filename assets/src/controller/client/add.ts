import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Client } from "../../../../common/Models";

let metaData = ApplicationServer.Application.GetTableMetaData('Client');

@ApplicationServer.Application.RegisterApplication({
    Group: 'Client',
    Order: 1,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '添加',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "ClientAdd",
    ModelMetaData: metaData
})
export class ClientController extends ControllerServer.AddController<Client> {
    public Width = '500px';

    public Height = '500px';

    public Resize = 'both';
}