import { Server as ActionServer } from '../../../server/action'
import { EnumActionType } from "../../../../../common/Enum";
import { IModelMetaData } from "../../../../../common/Models";
import Message from "../../../widgets/message";




export let ActionsInBar = (MetaData: IModelMetaData) => {
    return [
        {
            IconClassName: 'plus',
            ButtonName: '新增',
            Code(context: ActionServer.IActionContext, item: any, windowId: string) {
                context.ApplicationServer.Application.Open(`${MetaData.CollectionName}Add`, windowId);
            },
            Order: 1,
            Type: EnumActionType.TableBar,
            Name: 'Add'
        },
        {
            IconClassName: 'reload',
            ButtonName: '刷新',
            Code(context: ActionServer.IActionContext, item: any, windowId: string) {
                context.TaskServer.Task.SendSignal(windowId, 'Reload', []);
            },
            Order: 1,
            Type: EnumActionType.TableBar,
            Name: 'Reload'
        }
    ]
}

export let ActionsInTable: { (MetaData: IModelMetaData): Array<ActionServer.IActionItem> } = (MetaData: IModelMetaData) => {
    return [
        {
            IconClassName: 'delete',
            ButtonName: '删除',
            Code(context: ActionServer.IActionContext, item: any, windowId: string) {
                Message.Show({
                    Type: 'loading',
                    Content: '删除中!'
                })
                context.Asyncfetch(MetaData.CollectionName, 'Delete', [item._id]).then((res) => {
                    Message.Destory();
                    Message.Show({
                        Type: 'success',
                        Content: '删除成功'
                    });
                    context.TaskServer.Task.SendSignal(windowId, 'Reload', []);
                })
            },
            Order: 1,
            Type: EnumActionType.Table,
            Name: 'Delete'
        }
    ]
}