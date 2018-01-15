import { View } from "./base";
import * as React from 'react';
import { BehaviorSubject, Subscription } from "rxjs";
import { IModelMetaData } from "../../../common/Models";
import { IApplication, IApplicationGroup } from "../models/window";
import { Server } from "../server/application";
import { Button, Menu, Icon } from 'antd'


interface IProp {
    Applications$: BehaviorSubject<Array<IApplication>>
    ApplicationGroup: Array<IApplicationGroup>
    OnClick(app: IApplication):void 
    IsOpen$: BehaviorSubject<boolean>
}

interface IState {
    IsOpen: boolean
    Applications: Array<IApplication>
}

class MenuView extends View<IProp, IState>{
    private IsOpenSub$: Subscription;

    private ApplicationsSub$: Subscription

    constructor(para: IProp) {
        super(para)
        this.state = { IsOpen: para.IsOpen$.value, Applications: para.Applications$.value };
    }

    componentDidMount() {
        this.IsOpenSub$ = this.props.IsOpen$.subscribe((res: boolean) => {
            this.setState({ IsOpen: res });
        });

        this.ApplicationsSub$ = this.props.Applications$.subscribe((apps: Array<IApplication>) => {
            this.setState({ Applications: apps });
        });
    }
    componentWillUnmount() {
        this.IsOpenSub$.unsubscribe();
        this.ApplicationsSub$.unsubscribe();
    }
    getApplications = () => {
        if (!this.state.Applications) {
            return;
        }
        let ret:Array<any> = []
        this.props.ApplicationGroup.map((x,j)=>{
            let sub = this.state.Applications.filter((y)=>{
                return y.Group === x.Group && y.ShowType === 'List'
            }).sort((m,n)=>{
                return m.Order - n.Order;
            }).map((i,k)=>{
                return <Menu.Item key={i.Command} style={{ width: '100%' }} >
                    <div onClick={(e) => { e.preventDefault(); this.props.OnClick(i);}}>
                    <Icon type={i.IconName} />
                    {i.Name}
                    </div>
                </Menu.Item>
            })
            ret.push({
                order: x.Order,
                menu: <Menu.SubMenu 
                    key={`group${j}`}
                    title={<span><Icon type={x.IconName} /><span>{x.Name}</span></span>}>
                    {sub}
                </Menu.SubMenu>
            })
        })
        this.state.Applications.filter((x)=>{
            return (!x.Group || !this.props.ApplicationGroup.find((y)=>{
                return y.Group === x.Group;
            })) && x.ShowType === 'List'
        }).map((x,j)=>{
            ret.push({
                order: x.Order,
                menu: <Menu.Item 
                    key={x.Command}
                    >
                    <div onClick={(e) => { e.preventDefault(); this.props.OnClick(x);}}>
                    <span><Icon type={x.IconName} /><span>{x.Name}</span></span>
                    </div>
                </Menu.Item>
            })
        })
        return ret.sort((x,y)=>{
            return x.order - y.order
        }).map((x)=>{
            return x.menu;
        });
    }

    getQuickOpen = () => {
        if (!this.state.Applications) {
            return;
        }
        var result: any[] = [];
        this.state.Applications.forEach((item: IApplication, index: number) => {
            if (item.ShowType != 'Quick') {
                return;
            }
            result.push(
                <Button
                    style={{ marginBottom:'5px', border:'none' }}
                    key={index}
                    icon={item.IconName}
                    shape="circle-outline"
                    size="small"
                    onClick={() => { this.props.OnClick(item); }}
                />
            );
        })
        return result;
    }


    render() {
        return (
            <div
                style={{
                    transition: "0.3s height",
                    backgroundColor: '#404040',
                    color: 'white',
                    display: 'flex',
                    overflow: 'hidden',
                    width: this.state.IsOpen ? '35%' : 0,
                    height: this.state.IsOpen ? '70%' : 0,
                    opacity: 0.95,
                    zIndex: 10000
                }}>
                <div style={{padding:4, width: 30, height: "100%", display: 'flex', 'flexDirection': 'column-reverse' }}>
                    <div>
                        {
                            this.getQuickOpen()
                        }
                    </div>
                </div>
                <div style={{ width: 150, height: "100%", marginTop:'5px', marginBottom:'5px' }}>
                    <Menu
                        mode='inline'
                        selectedKeys={null}
                        theme='dark'
                    >
                    {
                        this.getApplications()
                    }
                    </Menu>
                </div>
            </div>
        );
    }
}

export default function (param: IProp) {
    return <MenuView {...param} />
}
