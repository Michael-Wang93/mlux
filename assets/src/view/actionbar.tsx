import { View } from "./base";
import { CSSProperties } from "react";
import {ILoginModel} from '../models/login'
import * as React from "react";
import { Server } from '../server/action'
import { Button, Dropdown, Icon, Menu } from "antd";
import { BehaviorSubject } from "rxjs";
import { ActionConfig } from "../../../common/Models";
import { EnumActionType } from "../../../common/Enum";

interface IProp{
    Actions:Array<Server.IActionInvoke>
    MassActions:Array<Server.IActionInvoke>
    DisplayMassAction$: BehaviorSubject<boolean>
}

interface IState{
    Open:boolean
}

class ActionBarView extends View<IProp, IState>{
    constructor(prop:IProp){
        super(prop);
        this.state = {Open:false}
    }
    componentDidMount(){
        this.props.DisplayMassAction$.subscribe((x)=>{
            this.setState({Open:x})
        })
    }
    private getAction(){
        return this.props.Actions.map((x,y)=>{
            return <Button onClick={(e)=>{x.Invoke(null)}} key={y} style={{marginLeft: 5}} type="primary" shape="circle" icon={x.IconClassName} />
        })
    }

    private getMassActions(){
        let actions = this.props.MassActions.map((x,y)=>{
            return <Menu.Item key={y}>{x.ButtonName}</Menu.Item>
        });
        return <Menu selectedKeys={null}>{actions}</Menu>
    }

    render() {
        return (<div style={{padding:5}}>
            <Dropdown overlay={this.getMassActions()} trigger={['click']}>
            <Button disabled={!this.state.Open}>
                批量操作 <Icon type="down" />
            </Button>
            </Dropdown>
            {this.getAction()}
        </div>);
    }
}


export default function(actions:Array<Server.IActionInvoke>,displayMassAction$:BehaviorSubject<boolean>){
    let action = actions.filter((x)=>{
        return x.Type !== EnumActionType.TableMass;
    })
    let massaction = actions.filter((x)=>{
        return x.Type === EnumActionType.TableMass;
    })
    return <ActionBarView 
            Actions={action} 
            MassActions={massaction}
            DisplayMassAction$={displayMassAction$}
            />
}