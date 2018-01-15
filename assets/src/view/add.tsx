import { View } from "./base";
import { CSSProperties } from "react";
import * as React from "react";
import { BehaviorSubject, Subscription } from 'rxjs'
import { Button } from "antd";


interface IBaseListProps {
    AddFormView:any
    OnAddClick():void
}

interface IBaseListState {

}

class AddView extends View<IBaseListProps, IBaseListState>{

    constructor(props:IBaseListProps){
        super(props)
        this.state = {};
    }

    render():any {
        return  <div style={{padding:5}}>  
                <div>
                    <Button onClick={()=>{ this.props.OnAddClick() }} type="primary" shape="circle" icon="save" size='small' />
                </div> 
                {this.props.AddFormView}
            </div>;
    }
}


export default function(para:IBaseListProps){
    return <AddView {...para}/>
}