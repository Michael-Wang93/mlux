import View from '../view/search/main'
import FieldFormView from '../view/search/fieldform'
import { Server } from '../server/search'


export default class Search {
    constructor(public SearchServer:Server.Search){
    }

    private onAdd(values:any){
        this.SearchServer.SetQuery(values);
    }
    
    public GetFieldSearchComponent(fieldname:string){
        let fieldmeta = this.SearchServer.GetSearchItem(fieldname);
        return FieldFormView({
            OnAdd: (values:any)=>{this.onAdd(values)},
            SearchItem: fieldmeta
        })
    }

    public async Render() {
        return View({
            OnSearch:(values)=> this.SearchServer.OnKeyWordSearch(values),
            Items: await this.SearchServer.GetSearchItems()
        });
    }
}