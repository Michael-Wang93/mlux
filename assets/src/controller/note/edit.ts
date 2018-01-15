import { Server as ApplicationServer } from '../../server/application'
import { Controller as ControllerServer } from '../base/add/main'
import { Server as TaskServer } from '../../server/taskmanager'
import { Server as AddServer } from '../../server/add'
import { Add } from '../../widgets/add'
import { Note } from "../../../../common/Models";
import { BehaviorSubject } from 'rxjs'
import { IAddHandler } from "../../models/window";
import * as uuid from 'uuid'

let metaData = ApplicationServer.Application.GetSubTableMetaData('Note');

@ApplicationServer.Application.RegisterApplication({
    ShowType: 'None',
    Command: "CommonNoteEdit",
    ModelMetaData: metaData
})
export class NoteEditController extends ControllerServer.AddController<Note> {
    private Data$: BehaviorSubject<Note>

    public Left = 0

    public Top = 0

    public OnAddClick(){
        this.AddView.GetFormData((data:Note)=>{
            let datatosync:any = {}
            let _:any = {}
            _[`${this.Ext.Path.join('.')}.$`]=data;
            datatosync={
                $set:_
            };
            let query:any = {};
            query[this.Ext.Path.join('.')] = { $elemMatch:{ID:data.ID}};
            AddServer.UpdateTo<string>(this.Ext.AppName,this.Ext.Record.value._id, query, datatosync);
            this.CloseSelf();
        })
    }

    async GetAddView(){
        let s:any = this.Ext.Record.value;
        let m = s['Note'].find((x:any)=>{
            return x.ID === this.Ext.ID;
        })
        let addconfig = new AddServer.AddConfigFromPath(this.Ext.AppName, this.Ext.Path);
        let add = new AddServer.Add<Note>(addconfig, new BehaviorSubject(m));
        this.AddView = new Add<Note>(add);
        return await this.AddView.Render();
    }
}