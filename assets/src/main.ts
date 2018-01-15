import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { Server } from './server/user'
import { Start } from './view/main'
import { InitData } from "./server/window";
import './controller/index'
import 'antd/dist/antd.css'
import '../css/ant-design-override.scss'

class Main{
    Render(){
        Start(Server.User.CurrentUser, InitData.Setting);
    }
}

new Main().Render()