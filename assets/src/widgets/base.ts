import view from '../view/base';
import {IWindowViewProps} from '../view/appwraper';
import * as React from 'react';

export function WindowViewIniter(props:IWindowViewProps){
    return view(props);
}