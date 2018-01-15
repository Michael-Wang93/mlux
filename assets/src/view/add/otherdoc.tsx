import { Server } from '../../server/add'
import { Input, Form, DatePicker, Rate, InputNumber, Radio, Checkbox, Upload, Icon, Select, Spin } from "antd";
import * as React from 'react';
import { FormLayout, FieldToFormItem } from './add'
import { IValueEnumItem } from "../../../../common/Field";
import { Observable } from "rxjs"
import { UploadFile, Asyncfetch } from "../../server/ajax";
import { View } from "../base";

class TempComponent extends View<any, any>{
    private fieldMeta: Server.IAddItem

    constructor(props: any, context: any) {
        super(props, context);
        this.fieldMeta = props.FieldMeta;
        this.state = { Data: [], Value: this.props.value }
    }

    componentWillReceiveProps(nextProps: any) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({Value: value});
        }
    }

    Fetch() {
        this.setState({ Fetching: true });
        Asyncfetch(this.fieldMeta.OtherType, 'List', []).then((x) => {
            this.setState({
                Data: x || [],
                Fetching: false
            })
        })
    }

    HandlerChange(value: any) {
        if (!('value' in this.props)) {
            this.setState({ Value: value });
        }
        this.TriggerChange(value);
    }
    TriggerChange(val: any) {
        if (this.props.onChange) {
            this.props.onChange(val);
        }
    }

    OnFocus() {
        this.Fetch();
    }

    render() {
        return <Select
            showSearch={true}
            value={this.state.Value}
            onChange={(e) => { this.HandlerChange(e) }}
            onFocus={() => { this.OnFocus() }}
            placeholder={`选择一个${this.fieldMeta.Description}`}
            notFoundContent={this.state.Fetching ? <Spin size="small" /> : null}
        >
            {this.state.Data.map((d: any, y: any) => { return <Select.Option key={y} value={d._id}>{d.CompanyName}</Select.Option> })}
        </Select>
    }
}

export default function RenderOtherDoc(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
            {...layout}
            label={field.Description}
            required={field.Required}
            key={field.Name}
        >{
            getFieldDecorator(field.Name,{
                rules: [ { required: true}]
            })(<TempComponent FieldMeta={field}/>)
        }</ Form.Item>
}
