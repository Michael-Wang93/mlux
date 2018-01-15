import { View } from "../base";
import * as React from "react";
import { BehaviorSubject, Subscription } from 'rxjs'
import { Table, Dropdown, Menu, Button, Icon } from 'antd'
import { Server } from '../../server/table'
import { Server as ActionServer } from '../../server/action'
import { ColumnProps } from "antd/lib/table/Column";
import { IFieldMeta } from "../../../../common/Field";
import * as FieldRender from './field'
import { TableRowSelection } from "antd/lib/table/Table";
import { IModelMetaData } from "../../../../common/Models";
import * as PropTypes from "prop-types";

let Mapping: { [key: string]: { (props: ITableFieldRenderProps): React.ReactNode } } = {
    String: FieldRender.RenderString,
    List: FieldRender.RenderList,
    Number: FieldRender.RenderNumber,
    Avatar: FieldRender.RenderAvatar,
    OtherDoc: FieldRender.RenderOtherDoc
}

export interface ITableFieldRenderProps {
    Text: any,
    Index: any
    Record: any,
    FieldMeta: IFieldMeta,
    ModelMeta: IModelMetaData,
    Context?: any
    SetValue(query: any, data: any): void
    Data$: BehaviorSubject<any[]>
    OnSave: { (id: string, query: any, data: any): void }
}

type IOwnColumnProps = Array<ColumnProps<any> & { Meta: IFieldMeta, Render?: { (props: ITableFieldRenderProps): React.ReactNode } }>

interface IProps {
    Opetations?: Array<ActionServer.IActionInvoke>
    Data$: BehaviorSubject<any[]>
    RowSelection?: TableRowSelection<any> & { Meta: IModelMetaData }
    Columns: IOwnColumnProps
    ModelMeta: IModelMetaData
    OnSave: { (id: string, query: any, data: any): void }
}

interface IState {
    Loading: boolean
    Columns: Array<ColumnProps<any> & { Meta?: IFieldMeta }>
    Data?: any[]
    FilterDropdownVisible: { [key: string]: boolean }
}


class TableView extends View<IProps, IState>{

    private DataSub$: Subscription;

    static contextTypes = {
        WindowId: PropTypes.string
    };

    constructor(props: IProps, context: any) {
        super(props, context)
        this.state = { Loading: true, Columns: this.DeltaRender(props.Columns), FilterDropdownVisible: {} };
    }


    componentDidMount() {
        this.DataSub$ = this.props.Data$.subscribe((data: any[]) => {
            let mydata = data.map((x, y) => {
                x.key = y;
                return x;
            })
            this.setState({ Data: mydata || [], Loading: false });
        })
    }

    componentWillUnmount() {
        this.DataSub$.unsubscribe();
    }

    DeltaRender(column: IOwnColumnProps) {
        return column.map((x) => {
            let render: { (props: ITableFieldRenderProps): React.ReactNode } = x.Render || Mapping[x.Meta.ViewType];
            x.render = (text: any, record: any, index: number) => {
                try {
                    return render({
                        Text: text,
                        Record: record,
                        Index: index,
                        FieldMeta: x.Meta,
                        ModelMeta: this.props.ModelMeta,
                        Context: this.context,
                        Data$: this.props.Data$,
                        SetValue: (query: any, data: any) => {
                            let id = this.state.Data[index]._id;
                            this.props.OnSave(id, query, data)
                        },
                        OnSave: this.props.OnSave
                    })
                } catch (error) {
                    console.warn(error);
                    return null;
                }

            }
            x.onFilterDropdownVisibleChange = (visible) => {
                let filterDropdownVisible = this.state.FilterDropdownVisible;
                filterDropdownVisible[x.Meta.Name] = visible;
                this.setState({
                    FilterDropdownVisible: filterDropdownVisible,
                });
            };
            return x as ColumnProps<any>;
        }).concat([{
            title: '操作',
            key: 'operator',
            dataIndex: 'operator',
            render: (text: any, record: any, index: number) => {
                return this.InitOperators(text, record, index);
            }
        }])
    }

    OnOperatorSelect(e: any, text: any, record: any, index: number) {
        this.props.Opetations.find((x) => {
            return x.Name === e.key
        }).Invoke(record);
    }

    InitOperators(text: any, record: any, index: number) {
        let items = this.props.Opetations.map((x) => {
            return <Menu.Item key={x.Name}><Icon type={x.IconClassName} />
                <span>{x.ButtonName}</span></Menu.Item>
        })
        let menu = (
            <Menu selectedKeys={null} onClick={(e) => { this.OnOperatorSelect(e, text, record, index) }}>
                {items}
            </Menu>
        );
        return <Dropdown overlay={menu}>
            <Button style={{ marginLeft: 8 }}>
                操作 <Icon type="down" />
            </Button>
        </Dropdown>
    }

    render(): any {
        if (this.state.Loading) {
            return null;
        }
        this.state.Columns.forEach((x) => {
            if (x.Meta && x.Meta.Name) {
                x.filterDropdownVisible = this.state.FilterDropdownVisible[x.Meta.Name];
            }
        })
        return (
            <div>
                <Table
                    dataSource={this.state.Data}
                    columns={this.state.Columns}
                    rowSelection={this.props.RowSelection}
                />
            </div>);
    }
}


export default function (para: IProps) {
    return <TableView {...para} />
}
