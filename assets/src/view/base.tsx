import * as React from 'react';
import { Icon, Button } from "antd";
import { CSSProperties } from "react";
import { IView, IWindowView } from "../models/window";
import { BehaviorSubject, Subscription } from 'rxjs'


export class View<T,K> extends React.Component<T, K> implements IView{

    constructor(props: T, context?:any) {
        super(props,context);
    }

    render():any{
        return null;
    }
}

export default function (param: any) {
    return <View {...param} />
}