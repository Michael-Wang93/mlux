import { View } from "../base";
import * as React from "react";
import { Upload, Icon, Select, Form, Tag, Input, Button } from "antd";
import { IModelMetaData } from "../../../../common/Models";
import { FormComponentProps } from "antd/lib/form/Form";
import { Server } from '../../server/excelimport'

interface IState {
    Model?: string
}


interface IOwnProps {
    OnSubmit(value:Server.IExcelImportParam):void
    Models: Array<IModelMetaData>
}

interface IProp extends FormComponentProps, IOwnProps {

}

class ExcelImport extends View<IProp, IState>{

    constructor(props: IProp) {
        super(props)
        this.state = {  };
    }

    private uuid = 0;

    private layout = {
        labelCol: {
            xs: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 12 }
        }
    }

    private formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 12, offset: 6 }
        }
      };

    GetFieldSelect(){
        return <Select style={{ width: '60%', marginRight: 8 }} >
            { this.props.Models.find((x)=>{
                return x.CollectionName === this.state.Model;
            }).Fields.map((y,z)=>{
                return <Select.Option key={z} value={y.Name}>{y.Description}</Select.Option>
            }) }
        </Select>
    }

    GetModelOptions() {
        return this.props.Models.map((x, y) => {
            return <Select.Option key={y} value={x.CollectionName}>{x.ModelName}</Select.Option>
        })
    }

    GetFieldItems() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k: any, index: any) => {
            return (
                <Form.Item
                    {...this.layout}
                    label={`第${index+1}列`}
                    required={true}
                    key={k}
                >
                    {getFieldDecorator(`names-${k}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "你必须选择一个系统字段对应这一列",
                        }],
                    })(
                        this.GetFieldSelect()
                        )}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.Remove(k)}
                        />
                    ) : null}
                </Form.Item>
            );
        });
        return formItems;
    }

    Remove = (k: any) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter((key: any) => key !== k),
        });
    }

    Add = () => {
        this.uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }


    NormFile(e: any) {
        if (e.fileList) {
            return e.fileList.map((x: any) => {
                if (x.response) {
                    return x.response;
                }
            })
        }
        return null;
    }

    GetModelSelect(){
        return <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个模块"
            onChange={(val:string)=>{
                this.setState({Model: val});
            }}
        >
            {this.GetModelOptions()}
        </Select>
    }

    render(): any {
        return <div style={{ padding: 5 }}>
            <Form onSubmit={(e) => { e.preventDefault(); 
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        let param = {
                            File: values['file'],
                            Model: values['model'],
                            Names: values.keys.map((x:any)=>{
                                return values[`names-${x}`]
                            })
                        }
                        this.props.OnSubmit(param);
                    }
                });
            }}>
                <Form.Item>
                    <Button type="primary" size="small" shape="circle" icon="save" htmlType="submit"></Button>
                </ Form.Item>
                <Form.Item
                    {...this.layout}
                    label="选择一个模块"
                    required={true}
                    key='model'
                >
                    {this.props.form.getFieldDecorator('model', {
                        rules: [{
                            required: true,
                            message: '必须选择一个模块'
                        }]
                    })(
                        this.GetModelSelect()
                        )}
                </ Form.Item>
                {this.GetFieldItems()}
                <Form.Item {...this.formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.Add} style={{ width: '60%' }}>
                    <Icon type="plus" /> 添加一列
                </Button>
                </Form.Item>
                <Form.Item
                    {...this.layout}
                    label="选择一个文件"
                    required={true}
                    key='file'
                >
                    {this.props.form.getFieldDecorator('file', {
                        rules: [{
                            required: true,
                            message: '必须选择一个文件'
                        }],
                        getValueFromEvent: this.NormFile,
                    })(
                        <Upload.Dragger  name="file" action="/uploadfile" listType="text">
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或者拖拽文件上传一个csv文件</p>
                            <p className="ant-upload-hint">您需要将excel另存为csv文件</p>
                        </Upload.Dragger>
                        )}
                </ Form.Item>
            </Form>
        </div>
    }
}

const WrappedAdd = Form.create()(ExcelImport);

export default function (para: IOwnProps) {
    return <WrappedAdd {...para} />
}