import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Goods } from "../../../../common/Models";

let metaData = ApplicationServer.Application.GetTableMetaData('Goods');

@ApplicationServer.Application.RegisterApplication({
    Group: 'Goods',
    Order: 1,
    AppName: metaData.CollectionName,
    Name: metaData.ModelName + '添加',
    IconName: metaData.ModelIcon,
    IconColor: metaData.IconColor,
    ShowType: 'List',
    Command: "GoodsAdd",
    ModelMetaData: metaData
})
export class GoodsController extends ControllerServer.AddController<Goods> {
    public Width = '500px';

    public Height = '600px';

    public Resize = 'both';
}