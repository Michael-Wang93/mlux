import { Server as AddServer } from '../../../server/add'
import { WindowHander } from "../base";
import View from '../../../view/add'
import { Add } from '../../../widgets/add'
import { ITask } from "../../../models/window";
import { Asyncfetch } from "../../../server/ajax";
import  Message from '../../../widgets/message'
import { Server as TaskServer } from '../../../server/taskmanager'


export namespace Controller {
    export class AddController<T> extends WindowHander{
        public BackgroundColor = 'white'

        public Left = 100;

        public Top = 100;

        public AddView:Add<T>;

        constructor(task:ITask){
            super(task)
        }

        public OnAddClick(){
            this.AddView.GetFormData((value:any)=>{
                Message.Show({
                    Type: 'loading',
                    Content: '保存中!'
                })
                Asyncfetch(this.MetaData.CollectionName,'Add',[value]).then((res)=>{
                    Message.Destory();
                    Message.Show({
                        Type: 'success',
                        Content: '保存成功'
                    })
                    TaskServer.Task.SendSignal(this.ParentId, 'Reload', []);
                });
            })
        }

        async GetAddView(){
            let addconfig = new AddServer.AddConfig(this.MetaData.CollectionName);
            let add = new AddServer.Add<T>(addconfig);
            this.AddView = new Add<T>(add);
            return await this.AddView.Render();
        }

        async InitView(){
            return View({
                AddFormView: await this.GetAddView(),
                OnAddClick: ()=>this.OnAddClick()
            });
        }
    }


}