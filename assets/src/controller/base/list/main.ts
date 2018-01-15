import { Server as ActionServer } from '../../../server/action'
import { Server as SearchServer } from '../../../server/search'
import { Server as TableServer } from '../../../server/table'
import { WindowHander, RegisterSignal } from "../base";
import View from '../../../view/list'
import ActionBarView from '../../../view/actionbar'
import TableView from '../../../widgets/table'
import SearchView from '../../../widgets/search'
import { ITask } from "../../../models/window";
import { BehaviorSubject } from 'rxjs'
import { EnumActionType } from "../../../../../common/Enum";
import { ActionsInBar, ActionsInTable} from './action'
import { adhocmap } from './columnadhocmap'
import { IFieldMeta } from "../../../../../common/Field";

export namespace Controller {
    export class ListController extends WindowHander {
        public BackgroundColor = 'white'

        public Data$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

        public DisplayMassAction$ = new BehaviorSubject<boolean>(false);

        public TableServer: TableServer.Table

        private SearchServer: SearchServer.Search

        public Left = 100;

        public Top = 100;

        private SearchView: SearchView

        public ActionsInTable = ActionsInTable(this.MetaData)

        public ActionsInBar = ActionsInBar(this.MetaData)

        constructor(task: ITask) {
            super(task)
        }

        @RegisterSignal
        public Reload() {
            this.TableServer.Reload()
        }

        private async getActionBar() {
            let config = new ActionServer.ActionConfig(
                this.MetaData.CollectionName,
                { "$or": [{ Type: EnumActionType.TableBar }, { Type: EnumActionType.TableMass }] });
            let actions = await new ActionServer.Action(config, this.Id).GetActions(this.ActionsInBar);
            return ActionBarView(actions, this.DisplayMassAction$);
        }

        private OnMassClick(rows: any) {
            if (rows && rows.length) {
                this.DisplayMassAction$.next(true);
            } else {
                this.DisplayMassAction$.next(false);
            }
        }

        private OnSetQury(values: any) {
            this.TableServer.SetQuery(values);
        }

        private OnRenderTableFilter(fieldmeta:IFieldMeta) {
            return this.SearchView.GetFieldSearchComponent(fieldmeta.Name);
        }

        private async getTableAction() {
            let config = new ActionServer.ActionConfig(
                this.MetaData.CollectionName,
                { Type: EnumActionType.Table });
            return await new ActionServer.Action(config, this.Id).GetActions(this.ActionsInTable);
        }

        private async getTableWidget() {
            let config = new TableServer.TableColumnConfig(this.MetaData.CollectionName);
            this.TableServer = await new TableServer.Table(
                this.Id, 
                this.MetaData, 
                config, 
                (row) => this.OnMassClick(row), 
                adhocmap, 
                await this.getTableAction(),
                (fieldmeta:IFieldMeta)=> this.OnRenderTableFilter(fieldmeta)
            );
            return await new TableView(this.TableServer).Render();;
        }

        private async getSearchWidget() {
            let config = new SearchServer.SearchConfig(this.MetaData.CollectionName);
            let search = new SearchServer.Search(config,(values)=>this.OnSetQury(values));
            this.SearchView = await new SearchView(search)
            return this.SearchView.Render();
        }

        async InitView() {
            let actionbar = await this.getActionBar();
            let searchview = await this.getSearchWidget();
            let tableView = await this.getTableWidget();
            return View({ TableView: tableView, ActionBar: actionbar, SearchView: searchview });
        }
    }
}