import * as React from 'react';
import {View} from './base';
import { Icon, Button } from "antd";
import { CSSProperties } from "react";
import { IView, IWindowView , IDashboard} from "../models/window";
import { BehaviorSubject, Subscription } from 'rxjs'
import * as PropTypes from  'prop-types'
import { LastClickPosition } from '../server/window'

export interface IWindowViewProps{
    Id:string
    Active$: BehaviorSubject<boolean>
    BackgroundColor: string
    Zindex$: BehaviorSubject<number>
    Opacity$: BehaviorSubject<number>
    Title: string
    Left: number
    Top: number
    Close(id:string):void
    Switch(id:string):void
    Minsize(id:string):void
    Icon: string
    ContentView:IView
    Width: string|number
    Height: string|number
    Resize: string
}

export interface IWindowViewState{
    Active: boolean
    Zindex: number
    Opacity: number
}

class WindowView extends View<IWindowViewProps, IWindowViewState> implements IWindowView{
    private Left:number = 100

    private Top: number = 100

    private Draging: boolean

    private DownLeft: number

    private DownTop: number

    private ZindexSub: Subscription

    private ActiveSub: Subscription

    private OpacitySub: Subscription

    private id: string

    get Id(){
        return this.id;
    }

    getChildContext() {
        return {WindowId: this.Id};
    }
    
    public static childContextTypes = {
        WindowId: PropTypes.string
    };

    constructor(props:IWindowViewProps) {
        super(props);
        this.Left = this.props.Left || LastClickPosition.X
        this.Top = this.props.Top || LastClickPosition.Y
        this.id = props.Id;
        this.state = {Active: props.Active$.value , Zindex: props.Zindex$.value ,Opacity: props.Opacity$.value};
    }
    
    componentDidMount(){
        if(!this.state){
            return;
        }
        let bar = this.refs.titleBar as Element;
        bar.addEventListener('mousedown', (ev: MSPointerEvent)=>{ this.MouseDown(ev) })
        document.addEventListener('mousemove', (ev: MSPointerEvent)=>{ this.MouseMove(ev) })
        bar.addEventListener('mouseup', (ev: MSPointerEvent)=>{ this.MouseUp(ev) })
        this.ActiveSub = this.props.Active$.subscribe((active:boolean)=>{
            this.setState({Active:active});
        })
        this.ZindexSub = this.props.Zindex$.subscribe((zindex:number)=>{
            this.setState({Zindex:zindex});
        })
        this.OpacitySub = this.props.Opacity$.subscribe((opacity:number)=>{
            this.setState({Opacity:opacity});
        })
    }

    componentWillUnmount(){
        this.ActiveSub.unsubscribe();
        this.ZindexSub.unsubscribe();
        this.OpacitySub.unsubscribe();
    }

    MouseDown(e:MSPointerEvent){
        this.DownLeft = e.clientX - this.Left;
        this.DownTop = e.clientY - this.Top;
        this.Draging = true;
    }

    MouseUp(e:MSPointerEvent){
        this.DownLeft = null;
        this.DownTop = null;
        this.Draging = false;
    }

    MouseMove(e:MSPointerEvent){
        if(!this.Draging){
            return;
        }
        this.Left = e.clientX - this.DownLeft;
        this.Top = e.clientY - this.DownTop;
        let main = this.refs.main as Element;
        let style = main.getAttribute('style').replace(/left: [\-0-9]+/, 'left: '+ this.Left.toString()).replace(/top: [\-0-9]+/, 'top: '+ this.Top.toString())
        main.setAttribute('style',style);
    }

     getStyles(){
        return {
            content:{
                display: this.state.Active ? 'block' : 'none' ,
                flexDirection: "column",
                position: 'absolute',
                left: this.Left,
                top: this.Top,
                backgroundColor: this.props.BackgroundColor,
                width: this.props.Width || 'auto',
                resize: this.props.Resize || 'botn',
                height: this.props.Height || 'auto',
                overflow: 'hidden',
                opacity: this.state.Opacity,
                zIndex: this.state.Zindex,
                borderRadius: '5px',
                boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'
            } as CSSProperties
        }
    }

    render() {
        if(!this.state){
            return null;
        }
        return (
            <div style={this.getStyles().content}  onMouseDown={()=>{ this.props.Switch(this.props.Id) }} ref="main">
                <div style={{display:'flex'}} ref="titleBar">
                    <div style={{padding: 12,alignSelf:'flex-start'}}>
                        <Icon type={this.props.Icon}/>
                    </div>
                    <div style={{width:'100%'}}></div>
                    <div style={{alignSelf:'flex-end', display:'flex', flexDirection:'row-reverse'}}>                    
                        <Button 
                            onClick={()=>this.props.Close(this.props.Id)}
                            icon='close'
                            size="large"
                            shape="circle"
                            type="ghost"
                            style={{border:'none'}}
                        />
                        <Button 
                            onClick={()=>this.props.Minsize(this.props.Id)}
                            icon='minus'
                            size="large"
                            shape="circle" 
                            type="ghost" 
                            style={{border:'none'}}
                        />
                    </div>
                </div>
                <div style={{maxHeight: this.props.Height,overflow:'scroll'}}>{this.props.ContentView}</div>
            </div>
        );
    }
}

export function AppWraperView(param:IWindowViewProps){
    
    return <WindowView {...param}/>;
}