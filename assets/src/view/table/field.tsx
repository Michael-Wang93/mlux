
import * as React from "react";
import moment from 'moment';
import { DatePicker, Button, Avatar } from "antd";
import { IFieldMeta } from "../../../../common/Field";
import { Server as ApplicationServer} from '../../server/application'
import * as PropTypes  from "prop-types";
import { IWindowContext, IListHandler } from "../../models/window";
import { IModelMetaData, Note } from "../../../../common/Models";
import { ITableFieldRenderProps } from "./main";
import { BehaviorSubject } from 'rxjs'

export let RenderString = (props:ITableFieldRenderProps) => {
    return <span key={props.Index}>{props.Text}</span>
}

export let RenderDateTime = (text: any, record: any, index: number) => {
    return <span key={index}>{text}</span>
}

export let RenderNumber = (props:ITableFieldRenderProps) => {
    return <span key={props.Index}>{props.Text}</span>
}

export let RenderRadio = (text: any, record: any, index: number) => {
    return <span key={index}></span>
}

export let RenderCheckBox = (text: any, record: any, index: number) => {
    return <span key={index}></span>
}

export let RenderList:any = (props:ITableFieldRenderProps) => {
    if(!props.Text){
        return <Button shape="circle" icon="plus" onClick={()=>{
            ApplicationServer.Application.Open(`CommonNoteAdd`,props.Context.WindowId,{Record:props.Record, AppName: props.ModelMeta.CollectionName, Path:[props.FieldMeta.Name]});
        }} type="primary"/>
    }
    if(props.Text && props.Text.length){
        let firstField = props.FieldMeta.IterType.Fields[0].Name;
        return <a onClick={()=>{
            let ext:IListHandler<any> = {
                Record: new BehaviorSubject(props.Record),
                AppName: props.ModelMeta.CollectionName,
                Path:[props.FieldMeta.Name],
                Meta: props.FieldMeta
            }
            ApplicationServer.Application.Open(`CommonNoteList`,props.Context.WindowId,ext);
        }}><span>{props.Text[props.Text.length-1][firstField]}</span></a>
    }
    return null;
}


export let RenderAvatar:any = (props:ITableFieldRenderProps) => {
    if(props.Text && props.Text.length){
        return props.Text.map((x:any,y:any)=>{
            return <Avatar  key={y} shape="square" size="large" src={`/preview/${ encodeURIComponent(x.Path)}`} />
        })
    }
    return null;
}

export let RenderOtherDoc:any = (props:ITableFieldRenderProps):any => {
    
    return null;
}
