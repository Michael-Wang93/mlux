import { ActionsInTable as  BaseActionsInTable } from '../base/list/action' 
import { IModelMetaData } from "../../../../common/Models";
import { Server as ActionServer } from '../../server/action'
import { EnumActionType } from "../../../../common/Enum";
import { Server as ApplicationServer } from '../../server/application'

export let ActionsInTable: { (MetaData: IModelMetaData): Array<ActionServer.IActionItem> } = (MetaData: IModelMetaData) => {
    let base = BaseActionsInTable(MetaData);
    let myaction = [
        {
            IconClassName: 'file-text',
            ButtonName: '备注',
            Code(context: ActionServer.IActionContext, item: any, windowId: string) {
                ApplicationServer.Application.Open(`CommonNoteAdd`,windowId,{Record:item, AppName: MetaData.CollectionName, Path:['Note']});
            },
            Order: 1,
            Type: EnumActionType.Table,
            Name: 'Note'
        }
    ]
    return base.concat(myaction);
}