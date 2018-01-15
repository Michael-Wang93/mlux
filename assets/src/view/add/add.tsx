import * as React from 'react';
import { render } from 'react-dom';
import { CSSProperties } from "react";
import { View } from "../base";
import { BehaviorSubject, Subscription } from 'rxjs'
import { IWindowHander, IView } from "../../models/window";
import { Server } from "../../server/add";
import { IFieldMeta } from "../../../../common/Field";
import { Form } from 'antd'
import { FormComponentProps } from "antd/lib/form/Form";
import * as FieldRender from './field'
import RenderOtherDoc from './otherdoc'

export interface FormLayout {
    labelCol: {
        xs: { span: number },
        sm?: { span: number }
    },
    wrapperCol: {
        xs: { span: number },
        sm?: { span: number }
    }
}

export let FieldToFormItem: { [key: string]: { (field: Server.IAddItem, layout: FormLayout, getFieldDecorator: any): void } } = {
    String: FieldRender.RenderString,
    DateTime: FieldRender.RenderDateTime,
    Number: FieldRender.RenderNumber,
    Rate: FieldRender.RenderRate,
    Switch: FieldRender.RenderSwitch,
    Radio: FieldRender.RenderRadio,
    JObject: FieldRender.RenderJObject,
    Avatar: FieldRender.RenderAvatar,
    OtherDoc: RenderOtherDoc
}

interface IState<T> {
}

interface IOwnProps<T> {
    Items: Array<Server.IAddItem>
    Data$?: BehaviorSubject<T>
    RegSubmit(fn:{(callback:{(value:any):void}):void}):void
}

interface IProp<T> extends FormComponentProps, IOwnProps<T> {

}

class Add<T> extends View<IProp<T>, IState<T>>{
    private DataSub:Subscription

    private Data:T

    private HasRenderFields:string[] = []

    constructor(props: IProp<T>) {
        super(props);
        this.props.RegSubmit((callback:{(value:any):void})=>{
            this.handleSubmit(callback);
        });
    }

    private layout = {
        labelCol: {
            xs: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 16 }
        }
    }
    componentDidMount(){
        this.DataSub = this.props.Data$ &&  this.props.Data$.subscribe((data:T)=>{
            if(data){
                this.Data = data;
                this.setData(data)
            };
        })
    }

    componentWillUnmount(){
        this.DataSub && this.DataSub.unsubscribe();
    }
    
    private setData(data:T){
        let d:any=data;
        let s:any={};
        this.HasRenderFields.forEach((x)=>{
            s[x] = d[x];
        })
        this.props.form.setFieldsValue(s);
    }

    private fieldToFieldItem(fieldMeta: Server.IAddItem) {
        if(!FieldToFormItem[fieldMeta.ViewType] || fieldMeta.Display == false){
            return null;
        }
        this.HasRenderFields.push(fieldMeta.Name);
        return FieldToFormItem[fieldMeta.ViewType](fieldMeta, this.layout, this.props.form.getFieldDecorator)
    }

    private getFieldItems() {
        return this.props.Items.map((x) => {
            return this.fieldToFieldItem(x)
        })
    }

    private handleSubmit(callback?:{(value:any):void}) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let newvalue = Object.assign({},this.Data || {}, values);
            if(callback){
                callback(newvalue);
            }
        });
    }

    render(): any {
        return <Form onSubmit={(e)=>{e.preventDefault();this.handleSubmit()}}>
            {this.getFieldItems()}
        </Form>;
    }
}

const WrappedAdd = Form.create()(Add);

export default function<T>(param: IOwnProps<T>) {
    return <WrappedAdd {...param} />
}
