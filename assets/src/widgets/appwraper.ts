import * as React from 'react';
import { IWindowViewProps, AppWraperView } from "../view/appwraper";

export function WindowViewIniter(params:IWindowViewProps){
    return AppWraperView(params);
}