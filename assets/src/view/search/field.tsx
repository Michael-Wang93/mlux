import { Server } from '../../server/search'
import { Input, Form, DatePicker, Rate, InputNumber, Radio, Checkbox } from "antd";
import * as React from 'react';
import { FieldToFormItem } from './fieldform'

const RadioGroup = Radio.Group;

export function RenderString(field: Server.SearchItem,onChange:any) {
    return <Input onChange={(e)=>{onChange(e.target.value)}}/>
}

export function RenderDateTime(field: Server.SearchItem,onChange:any) {
    return <DatePicker onChange={(val)=>{onChange(val)}}/>
}

export function RenderRate(field: Server.SearchItem,onChange:any) {
    return <Rate onChange={(val)=>{onChange(val)}}/>
}

export function RenderNumber(field: Server.SearchItem,onChange:any) {
    return <InputNumber onChange={(val)=>{onChange(val)}}/>
}

export function RenderCheckBox(field: Server.SearchItem,onChange:any) {
    return <Checkbox onChange={(val)=>{onChange(val)}}/>
}


export function RenderRadio(field: Server.SearchItem,onChange:any) {
    return <RadioGroup onChange={(val)=>{onChange(val)}}>
        {field.FieldMeta.ValueEnum.map((item: any) => {
            <Radio>{item}</Radio>
        })};
            </RadioGroup>
}

