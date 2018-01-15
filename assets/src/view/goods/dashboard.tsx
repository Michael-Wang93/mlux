import { View } from "../base";
import { CSSProperties } from "react";
import * as React from "react";
import { BehaviorSubject, Subscription } from 'rxjs'
import { Button } from "antd";


interface IProps {
}

interface IState {

}

class DasboardView extends View<IProps, IState>{

    constructor(props:IProps){
        super(props)
    }

    render():any {
        return <div style={{
            backgroundColor:'blue',
            opacity: 0.9,
            padding: 3,
            width: '100px',
            height: '100px'
        }}><p style={{ color:'white' }}>嘿嘿</p></div>
    }
}


export default function(para:IProps){
    return <DasboardView {...para}/>
}