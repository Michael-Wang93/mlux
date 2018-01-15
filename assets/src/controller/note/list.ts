import { Server as ApplicationServer } from '../../server/application'
import { Server as DashboardServer } from '../../server/dashboard'
import { Server as AddServer } from '../../server/add'
import { Note } from "../../../../common/Models";
import { Controller as ControllerServer } from '../base/list/main'
import { RegisterSignal } from "../base/base";
import View from '../../view/note/list'
import { Server as TaskServer } from '../../server/taskmanager'
import { IAddHandler, IListHandler } from "../../models/window";

let metaData = ApplicationServer.Application.GetSubTableMetaData('Note');

@ApplicationServer.Application.RegisterApplication({
    ShowType: 'None',
    Command: "CommonNoteList",
    ModelMetaData: metaData
})
export class NoteListController extends ControllerServer.ListController {
    public Width = '330px';

    public Height = 'auto';
    
    public Resize = 'both';

    public BackgroundColor = 'rgb(236, 236, 236)';

    public Ext:IListHandler<Note>

    async InitView() {
        return View({
            Data$: this.Ext.Record,
            OnClick: (record:Note)=>{
                let ext:IAddHandler<any> = {
                    AppName: this.Ext.AppName,
                    Record: this.Ext.Record,
                    Path: ['Note'],
                    ID: record.ID
                }
                ApplicationServer.Application.Open(`CommonNoteEdit`, this.ParentId ,ext);
            },
            Path: this.Ext.Path,
            MetaField: this.Ext.Meta
        });
    }
}