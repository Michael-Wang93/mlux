import { View } from "./base";
import { CSSProperties } from "react";
import * as React from "react";
import { BehaviorSubject, Subscription } from 'rxjs'


interface IBaseListProps {
    ActionBar: any
    TableView: any
    SearchView: any
}

interface IBaseListState {

}

class ListView extends View<IBaseListProps, IBaseListState>{

    constructor(props:IBaseListProps){
        super(props)
        this.state = {};
    }

    render():any {
        return(
            <div>   
                <div>
                    {this.props.SearchView}
                </div>
                <div>
                    {this.props.ActionBar}
                </div>
                <div>
                    {this.props.TableView}
                </div>
            </div>);
    }
}


export default function(para:IBaseListProps){
    return <ListView {...para}/>
}