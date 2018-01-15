

import { View } from "../base";
import { CSSProperties } from "react";
import * as React from "react";
import { Button, Dropdown, Icon, Menu, Card } from "antd";
import { BehaviorSubject } from "rxjs";
import { Note } from "../../../../common/Models";
import { IFieldMeta } from "../../../../common/Field";


interface IProp {
    Data$: BehaviorSubject<Note[]>
    MetaField: IFieldMeta
    OnClick(Record: any): void
    Path: string[]
}

interface IState {
    Data:Note[]
}

class NoteListView extends View<IProp, IState>{
    constructor(prop: IProp) {
        super(prop);
        this.state = { Data: this.props.Data$.value }
    }
    private DataSub:any

    private initCard(x: any | Note, y: number): any {
        return this.props.MetaField.IterType.Fields.map((m,n) => {
            return <p key={n}>{x[m.Name]}</p>
        })
    }

    componentWillUnmount(){
        this.DataSub.unsubscribe();
    }

    componentDidMount(){
        this.DataSub = this.props.Data$ &&  this.props.Data$.subscribe((data:Note[])=>{
            if(data){
                this.setState({Data:data})
            };
        })
    }
    
    findDataByPath(data:any,path:string[]){
        if(!path){
            return data;
        }
        let ret=data;
        for(let x of path){
            ret = ret[x];
        }
        return ret;
    }

    render(): any {
        if (!this.state.Data) {
            return null;
        }
        let data = this.findDataByPath(this.state.Data,this.props.Path);
        return (<div>{data.map((x:any, y:number) => {
            return <div key={y} style={{ background: '#ECECEC', padding: '15px' }} onClick={() => this.props.OnClick(x)}>
                <Card  bordered={false} style={{ width: 300 }}>
                    {this.initCard(x, y)}
                </Card>
            </div>
        }).reverse()}</div>)
    }
}

export default function (para: IProp) {
    return <NoteListView {...para} />
}
