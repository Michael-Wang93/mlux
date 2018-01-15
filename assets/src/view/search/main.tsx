import { View } from "../base";
import * as React from "react";
import { Server } from '../../server/search'
import { RenderString } from './field'
import { Input } from "antd";

interface IProps {
    Items: Array<Server.SearchItem>
    OnSearch: {(keyword:string):void}
}

interface IStates {
}

export let FieldToFormItem: { [key: string]: { (field: Server.SearchItem, getFieldDecorator: any): void } } = {
    String: RenderString
}

class SearchView extends View<IProps, IStates>{

    constructor(props: IProps) {
        super(props)
        this.state={};
    }

    render(): any {
        return <div style={{ width: 400, padding: 5 }}><Input.Search
            placeholder="Search"
            style={{minHeight: 25}}
            onSearch={value => this.props.OnSearch(value)}
        ></Input.Search></div>
    }
}


export default function (para: IProps) {
    return <SearchView {...para} />
}