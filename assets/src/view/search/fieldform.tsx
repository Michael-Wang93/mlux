import { View } from "../base";
import * as React from "react";
import { Server } from '../../server/search'
import { RenderString } from './field'
import { Input, Button, Select } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";


interface IProps {
    OnAdd(values:any):void
    SearchItem: Server.SearchItem
}

interface IStates {
    Value:any
}

export let FieldToFormItem: { [key: string]: { (field: Server.SearchItem,onChange:{(value:any):void}): React.ReactNode } } = {
    String: RenderString
}

class FieldSearchForm extends View<IProps, IStates>{
    
    constructor(props: IProps) {
        super(props);
    }

    private fieldToFieldItem(searchItem: Server.SearchItem):React.ReactNode {
        if(!FieldToFormItem[searchItem.FieldMeta.ViewType]){
            return null;
        }
        return FieldToFormItem[searchItem.FieldMeta.ViewType](searchItem,(val)=>this.OnValueChange(val)) || null
    }

    private handleSubmit() {
        let values:any = {};
        if(this.state.Value){
            values[this.props.SearchItem.FieldMeta.Name] = {'$regex': `${this.state.Value}`}
        }
        this.props.OnAdd(values);
    }

    private OnValueChange(value:any){
        this.setState({Value:value});
    }

    render(): any {
        return (
            <div className="custom-filter-dropdown">
                {this.fieldToFieldItem(this.props.SearchItem)}
                <Button type="primary" onClick={(e)=>{e.preventDefault(); this.handleSubmit()}}>搜索</Button>
            </div>
        );
    }   
}


export default function (para: IProps) {
    return <FieldSearchForm {...para} />
}