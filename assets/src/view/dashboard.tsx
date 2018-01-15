import { View } from "./base";
import * as React from 'react'
import { CSSProperties } from "react";
import { IDashboard } from "../models/window";
import { BehaviorSubject, Subscription } from 'rxjs'

interface IProp {
    Dashboards$: BehaviorSubject<Array<IDashboard>>
}

interface IState {
    Dashboards: Array<IDashboard>
}

class DashboardView extends View<IProp, IState>{
    private DashboardsSub:Subscription;

    constructor(para: IProp) {
        super(para)
    }

    componentDidMount() {
        this.DashboardsSub = this.props.Dashboards$.subscribe((dashboards: Array <IDashboard>) => {
            this.setState({ Dashboards: dashboards });
        })
    }

    componentWillUnmount(){
        this.DashboardsSub && this.DashboardsSub.unsubscribe();
    }

    GetItems() {
        let result: any = [];
        if (!this.state || !this.state.Dashboards) {
            return null;
        }
        this.state.Dashboards.forEach((item: IDashboard, key: number) => {
            result.push(<li key={key} onClick={(e) => { e.preventDefault(); item.OnClick();}} >
                { item.Render() }
            </li>)
        })
        return result;
    }

    render() {
        return <ul style={{display: 'flex', position:'absolute', listStyleType: 'none',paddingLeft: 0}}>
            {this.GetItems()}
        </ul>
    }
}


export default function (param: IProp) {
    return <DashboardView {...param} />
}