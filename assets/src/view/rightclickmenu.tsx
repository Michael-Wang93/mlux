import * as React from 'react';
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import {Children} from "react";
import { IRightClickMenuItem } from "../widgets/rightclickmenu";
import { View } from "./base";

interface IRightClickMenuProps<T>{
    Items: Array<IRightClickMenuItem<T>>
    WindowId: string
}

export default class RightClickMenu<T> extends View<IRightClickMenuProps<T>, void>{

    constructor(props:IRightClickMenuProps<T>) {
        super(props);
    }

    getItem(){
        return this.props.Items.map((x:IRightClickMenuItem<T>, y:number)=>{
            // return <Option primaryText={x.Label} key={y} onClick={()=>{x.OnSelect()}}/>
            return null;
        })
    }

    render() {
        return(
            <div>
                <ContextMenuTrigger id={this.props.WindowId}>
                    {Children.only(this.props.children)}
                </ContextMenuTrigger>
                <ContextMenu id={this.props.WindowId}>
                    <div >
                        {this.getItem()}
                    </div>
                </ContextMenu>
            </div>)
    }
}