import * as React from 'react';
import { render } from 'react-dom';
import { CSSProperties } from "react";
import { View } from "./base";
import { BehaviorSubject,Subscription } from 'rxjs'
import { IWindowHander, IView } from "../models/window";
import { SetLastClickPosition } from "../server/window";

interface IState{
    Windows:Array<IView>
}

interface IProp{
    Windows$: BehaviorSubject<Array<IView>>
}

class Desktop extends View<IProp, IState>{
    private WindowsSub$: Subscription

    constructor(props:IProp){
        super(props);
    }

    componentDidMount() {
        this.WindowsSub$ = this.props.Windows$.subscribe((wins:Array<IView>) => {
            this.setState({ Windows: wins });
        });
        
    }
    componentWillUnmount() {
        this.WindowsSub$.unsubscribe();
    }

    getWindow(){
        if(!this.state || !this.state.Windows){
            return null;
        }
        return this.state.Windows.map((win:IView & {props:any})=>{
            return <div key={win.props.Id}>{win}</div>;
        })
    }

    render():any {
        return <div onClick={(e)=>{SetLastClickPosition({
                X: e.clientX,
                Y: e.clientY
            })}}>{this.getWindow()}</div>;
    }
}

export default function(param:IProp){
    return <Desktop {...param}/>
}
