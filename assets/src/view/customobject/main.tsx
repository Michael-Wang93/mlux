import { View } from "../base";
import { CSSProperties } from "react";
import {ILoginModel} from '../../models/login'
import * as React from "react";


class CustomObjectView extends View<{}, {}>{
    render() {
        return (<div >
            <p>哈哈哈</p>
        </div>);
    }
}


export default function(){
    return <CustomObjectView />
}