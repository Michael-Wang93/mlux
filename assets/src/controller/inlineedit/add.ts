import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Server as TaskServer } from '../../server/taskmanager'
import { Server as AddServer } from '../../server/add'
import { Add } from '../../widgets/add'
import { Note } from "../../../../common/Models";
import { BehaviorSubject } from 'rxjs'

let metaData = ApplicationServer.Application.GetSubTableMetaData('Note');

@ApplicationServer.Application.RegisterApplication({
    ShowType: 'None',
    Command: "InLineAdd",
    ModelMetaData: metaData
})
export class AvatarAdd extends ControllerServer.AddController<Note> {
    private Data$: BehaviorSubject<Note>

    public Left = 0

    public Top = 0

    public OnAddClick(){
        this.AddView.GetFormData((value:any)=>{
            TaskServer.Task.SendSignal(this.ParentId, 'AddNote', [value, this.Ext.Record]);
            this.CloseSelf();
        })
    }

    async GetAddView(){
        let addconfig = new AddServer.AddConfigFromPath(this.Ext.AppName, this.Ext.Path);
        let add = new AddServer.Add<Note>(addconfig);
        this.AddView = new Add<Note>(add);
        return await this.AddView.Render();
    }
}