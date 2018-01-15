import { View } from "./base";
import * as React from 'react'
import { CSSProperties } from "react";
import { ITask } from "../models/window";
import { BehaviorSubject } from 'rxjs'
import {Button} from 'antd'


interface IProp {
    Tasks$: BehaviorSubject<Map<string, ITask>>
    OnClickItem: { (id: string): void }
}

interface IState {
    Tasks: Array<ITask>
}

class TaskManagerView extends View<IProp, IState>{

    constructor(para: IProp) {
        super(para)
    }

    componentDidMount() {
        this.props.Tasks$.subscribe((tasks: Map<string, ITask>) => {
            if (!tasks) {
                return;
            }
            let tasklst: any = []
            tasks.forEach((x: ITask) => {
                tasklst.push(x)
            })
            this.setState({ Tasks: tasklst });
        })
    }

    getStyles = (task:ITask) => {
        return {
            li: {
                marginLeft: 3,
                backgroundColor: "rgb(48, 48, 48)",
                borderBottomColor: task.Active ? 'red' : 'transparent',
                borderBottomStyle: 'solid',
                borderBottomWidth: 1
            } as CSSProperties
        }
    }


    getItems() {
        let result: any = [];
        if (!this.state || !this.state.Tasks) {
            return null;
        }
        this.state.Tasks.forEach((task: ITask, key: number) => {
            result.push(<li key={key} style={this.getStyles(task).li} onClick={() => { this.props.OnClickItem(task.Id) }}>
                <Button size="large" style={{border:'none', borderRadius: 0}}
                    icon={task.Icon || 'smile'}
                />
            </li>)
        })
        return result;
    }

    render() {
        return <ul style={{display: 'flex',listStyleType: 'none',paddingLeft: 0}}>
            {this.getItems()}
        </ul>
    }
}


export default function (param: IProp) {
    return <TaskManagerView {...param} />
}