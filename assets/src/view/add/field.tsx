import { Server } from '../../server/add'
import { Input, Form, DatePicker, Rate, InputNumber, Radio, Checkbox, Upload, Icon, Select, Spin } from "antd";
import * as React from 'react';
import { FormLayout, FieldToFormItem } from './add'
import { IValueEnumItem } from "../../../../common/Field";
import { Observable } from "rxjs"
import { UploadFile, Asyncfetch } from "../../server/ajax";
import { View } from "../base";

const RadioGroup = Radio.Group;

export function RenderString(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name, {
            rules: [{ required: field.Required, message: `请输入${field.Description}` }],
        })(
            <Input />
            )}
    </ Form.Item>

}

export function RenderDateTime(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <DatePicker />
        )}
    </ Form.Item>
}

export function RenderRate(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <Rate />
        )}
    </ Form.Item>
}

export function RenderNumber(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <InputNumber />
        )}
    </ Form.Item>
}

export function RenderCheckBox(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <Checkbox />
        )}
    </ Form.Item>
}


export function RenderRadio(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <RadioGroup>
                {field.ValueEnum.map((item: IValueEnumItem, y) => {
                    return <Radio key={y} value={item.Value}>{item.Label}</Radio>
                })}
            </RadioGroup>
        )}
    </ Form.Item>
}

export function RenderSwitch(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(
            <RadioGroup>
                {field.ValueEnum.map((item: any) => {
                    <Radio>{item}</Radio>
                })};
            </RadioGroup>
        )}
    </ Form.Item>
}

export function RenderJObject(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name)(

        )}
    </ Form.Item>
}

export function RenderAvatar(field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any) {
    let normFile = (e: any): any => {
        if (e.fileList) {
            return e.fileList.map((x: any) => {
                if (x.response) {
                    return x.response;
                }
            })
        }
        return null;
    }
    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return <Form.Item
        {...layout}
        label={field.Description}
        required={field.Required}
        key={field.Name}
    >
        {getFieldDecorator(field.Name, {
            getValueFromEvent: normFile,
        })(
            <Upload name="files" action="/uploadfile" listType="picture-card">
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
            </Upload>
            )}
    </ Form.Item>
}






