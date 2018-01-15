import { View } from './base'
import * as React from 'react'
import { CSSProperties } from "react";
import { Setting, User, IModelMetaData } from "../../../common/Models";
import { render } from 'react-dom'
import Login from '../widgets/login'
import { TaskManager } from '../widgets/taskmanager'
import Menu from '../widgets/menu'
import { Desktop } from '../widgets/desktop'
import { Dashboard } from '../widgets/dashboard'
import { Server as DashboardServer } from '../server/dashboard'
import { BehaviorSubject } from "rxjs";
import { Server } from '../server/application'
import { Server as dashboardSever} from '../server/dashboard'
import { Button }  from 'antd'

interface IProp {
    Setting: Setting
    User: User
}

interface IState {

}

class App extends View<IProp, IState>{
    constructor(props: IProp) {
        super(props);
    }


    getStyles = () => {
        return {
            main: {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundSize: 'cover',
                backgroundImage: `url(${this.props.Setting.BackgroundImage})`
            } as CSSProperties,
            Container: {
                display: 'flex',
                width: '100%',
                height: '100%',
                flexDirection: 'column-reverse'
            } as CSSProperties,
            taskBar: {
                margin: 0,
                padding: 0,
                width: '100%',
                listStyle: 'none',
                backgroundColor: "rgb(0, 4, 8)",
                display: 'flex',
                opacity: 0.85,
                zIndex: 10000
            } as CSSProperties
        }
    }
    getLoginWidget() {
        if (this.props.User) {
            return null;
        }
        return new Login().Render();
    }

    getDesktop() {
        if (this.props.User) {
            return new Desktop().Render();
        }
        return null;
    }
    
    getDashboardWidget() {
        if (this.props.User) {
            return new Dashboard(DashboardServer.Dashboard).Render();
        }
        return null;
    }

    getTaskWidget() {
        if (this.props.User) {
            return <div style={this.getStyles().Container}>
                <ul style={this.getStyles().taskBar}>
                    <li style={{ 'borderBottomColor': 'transparent', 'borderBottomStyle': 'solid', 'borderBottomWidth': 1 }}>
                        <Button
                            onClick={() => { Menu.Toggle() }}
                            icon='windows'
                            size="large"
                            style={{border:'none', color:'white', backgroundColor:'transparent'}}
                        />
                    </li>
                    {new TaskManager({}).Render()}
                </ul>
                {new Menu({
                    Applications$: Server.Application.Applications$,
                    OnClick: Server.Application.OpenByApplication,
                    ApplicationGroup: Server.Application.ApplicationGroup
                }).Render()}
            </div>
        }
        return null;
    }

    render() {
        return <div style={this.getStyles().main}>
            {this.getLoginWidget()}
            {this.getDashboardWidget()}
            {this.getTaskWidget()}
            {this.getDesktop()}
        </div>
    }
}

export function Start(user$: BehaviorSubject<User>, setting: Setting) {
    user$.subscribe((user: User) => {
        render(<App Setting={setting} User={user} />, document.getElementById('app'));
    })
}
