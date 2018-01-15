import "reflect-metadata";
import { IFieldMeta, StringField, BooleanField, NumberField, RadioField, ListField, ObjectField, IValueEnumItem, AvatarField, OtherDocField } from './Field'
import { FieldTypeEnum, EnumActionType, EnumSexType } from "./Enum";


export enum ModelOrFieldType {
    Field,
    Model,
    SubModel
}

export interface IRightClickMenu {
    Name: string
    Command: string
}

export interface IModelMetaData {
    ModelName?: string;
    CollectionName?: string;
    ModelIcon?: string;
    IconColor?: string;
    Fields?: Array<IFieldMeta>
    IsSub?: boolean
    Type?: string
    RightClickMenu?: Array<IRightClickMenu>
}

export interface ISubModelMetaData {
    Fields?: Array<IFieldMeta>
    Name?: string
    IsSub?: boolean
    Type?: string
}

export var ModelMetaKey = Symbol('ModelMetaKey');
export var Models: Map<string, IModelMetaData> = new Map();
export var SubModels: Map<string, ISubModelMetaData> = new Map();
export var ModelFieldsMap: { [key: string]: Array<IFieldMeta> } = {}

export var ModelMetaData = function (metaData: IModelMetaData) {
    return function (target: any) {
        metaData.Fields = ModelFieldsMap[target.name] || [];
        metaData.CollectionName = target.name;
        metaData.Type = ModelOrFieldType.Model.toString();
        Models.set(metaData.CollectionName, metaData);
        Reflect.defineMetadata(ModelMetaKey, metaData, target);
    }
}

export var SubModelMetaData = function (metaData: ISubModelMetaData = {}) {
    return function (target: any) {
        metaData.Fields = ModelFieldsMap[target.name] || [];
        metaData.Name = target.name;
        metaData.Type = ModelOrFieldType.SubModel.toString();
        metaData.IsSub = true;
        SubModels.set(metaData.Name, metaData);
    }
}


export var FieldMetaData = function (metaObj: IFieldMeta) {
    return function (target: any, key: string) {
        metaObj.Name = key;
        Reflect.defineMetadata(ModelMetaKey, metaObj, target, key);
        let name = target.constructor.name;
        if (ModelFieldsMap[name]) {
            ModelFieldsMap[name].push(metaObj);
        } else {
            ModelFieldsMap[name] = [metaObj];
        }
    }
}



export interface IModel {
    _id: string
}

export interface ISubModel {

}


@ModelMetaData({
    ModelName: '用户',
    ModelIcon: 'user',
    IconColor: '#757575'
})

export class Model implements IModel {
    @FieldMetaData(new StringField({ Description: 'ID' }))
    _id: string

    static GetMetaData(): IModelMetaData {
        return Reflect.getOwnMetadata(ModelMetaKey, this);
    }

    static GetCollectionName(): string {
        return Model.GetMetaData().CollectionName;
    }

}

export class User extends Model {
    @FieldMetaData(new StringField({ Description: '姓名'}))
    Name: string

    @FieldMetaData(new StringField({ Description: '手机'}))
    Mobile: string

    @FieldMetaData(new StringField({ Description: '密码'}))
    Password: string
}

export class SubModel implements ISubModel {
    static GetMetaData(): IModelMetaData {
        return Reflect.getOwnMetadata(ModelMetaKey, this);
    }

    @FieldMetaData(new StringField({ Description: '手机'}))
    AddedBy?: User

    @FieldMetaData(new StringField({ Description: '密码'}))
    AddedDate?: Date

    @FieldMetaData(new StringField({ Description: '密码'}))
    LastUpdateDate?: Date

    @FieldMetaData(new StringField({ Description: '密码'}))
    LastUpdateBy?: User
}




@ModelMetaData({
    ModelName: '自定义对象',
    ModelIcon: 'appstore',
    IconColor: '#757575',
    RightClickMenu: [{ Name: '发送到桌面', Command: 'CustomObject.SendToDesktop' }]
})
export class CustomObject extends Model implements IModelMetaData {
    @FieldMetaData(new StringField({ Description: '模型名' }))
    ModelName: string
    @FieldMetaData(new StringField({ Description: '数据库集合名' }))
    CollectionName: string
    @FieldMetaData(new StringField({ Description: '模型按钮' }))
    ModelIcon: string
    @FieldMetaData(new StringField({ Description: '模型按钮颜色' }))
    IconColor: string
    @FieldMetaData(new BooleanField({ Description: '是否可以更改' }))
    ModifyAble: boolean
    @FieldMetaData(new ListField({ Description: '所有字段', ViewType: 'Fields' }))
    Fields: Array<IFieldMeta>
    @FieldMetaData(new ListField({ Description: '右键菜单', ViewType: 'Fields' }))
    RightClickMenu: Array<IRightClickMenu>
    @FieldMetaData(new BooleanField({ Description: '是否子对象' }))
    IsSub: boolean
    @FieldMetaData(new BooleanField({ Description: '是否哈希' }))
    Hashable: boolean
}

@ModelMetaData({
    ModelName: '字段属性',
    ModelIcon: 'user',
    IconColor: '#757575'
})
export class FieldAttribute extends Model implements IFieldMeta {
    @FieldMetaData(new BooleanField({ Description: '能否枚举'}))
    Enumable: boolean;
    @FieldMetaData(new BooleanField({ Description: '能否迭代'}))
    Iterable: boolean;
    @FieldMetaData(new ListField({ Description: '枚举值' }))
    ValueEnum: Array<IValueEnumItem>;
    @FieldMetaData(new RadioField({ Description: '视图类型', ValueEnum: FieldTypeEnum}))
    ViewType: string;
    @FieldMetaData(new StringField({ Description: '字段名'}))
    Name: string
    @FieldMetaData(new BooleanField({ Description: '是否内建'}))
    Buildin: boolean
    @FieldMetaData(new StringField({ Description: '字段描述' }))
    Description: string
    @FieldMetaData(new StringField({ Description: '子对象'}))
    Children: any
    @FieldMetaData(new StringField({ Description: '能否子对象'}))
    Childable: boolean
    @FieldMetaData(new StringField({ Description: '类型'}))
    Type: string
}

@ModelMetaData({
    ModelName: '设置',
    ModelIcon: 'setting',
    IconColor: '#757575',

})
export class Setting extends Model {
    @FieldMetaData(new StringField({ Description: '背景图' }))
    BackgroundImage: string

    @FieldMetaData(new StringField({ Description: '主题色' }))
    MainColor: string;
}

@ModelMetaData({
    ModelName: '动作配置',
    ModelIcon: 'setting',
    IconColor: '#757575'
})
export class ActionConfig extends Model {
    @FieldMetaData(new BooleanField({ Description: '内建'}))
    IsBuildin: true

    @FieldMetaData(new StringField({ Description: '名称'}))
    Name: string

    @FieldMetaData(new StringField({ Description: '按钮名称'}))
    ButtonName: string;

    @FieldMetaData(new StringField({ Description: '按钮名称'}))
    IconClassName: string;

    @FieldMetaData(new RadioField({ Description: '按钮类型', ValueEnum: EnumActionType}))
    Type: string;

    @FieldMetaData(new StringField({ Description: '应用名称'}))
    AppName: string;

    @FieldMetaData(new StringField({ Description: '序值'}))
    Order: number;

    @FieldMetaData(new StringField({ Description: '代码'}))
    Code: string;
}

@ModelMetaData({
    ModelName: '搜索配置',
    ModelIcon: 'setting',
    IconColor: '#757575'
})
export class SearchConfig extends Model {
    @FieldMetaData(new StringField({ Description: '名称'}))
    Name: string

    @FieldMetaData(new StringField({ Description: '应用名称'}))
    AppName: string;

    @FieldMetaData(new StringField({ Description: '搜索条件'}))
    Operators: string;
}

@SubModelMetaData()
export class AddConfigItem extends SubModel {
    @FieldMetaData(new StringField({ Description: '内容'}))
    Name: string

    @FieldMetaData(new BooleanField({ Description: '必填'}))
    Required?: boolean

    @FieldMetaData(new StringField({ Description: '默认值'}))
    Default?: string

    @FieldMetaData(new ListField({ Description: '配置信息'}))
    Meta?: Array<AddConfigItem>
}

@ModelMetaData({
    ModelName: '添加配置'
})
export class AddConfig extends Model {
    @FieldMetaData(new StringField({ Description: '应用名称'}))
    AppName: string;

    @FieldMetaData(new ListField({ Description: '必填', IterType: AddConfigItem}))
    Config: Array<AddConfigItem>;
}


@SubModelMetaData()
export class Note extends SubModel {
    @FieldMetaData(new StringField({ Description: '内容'}))
    Comment: string

    @FieldMetaData(new StringField({ Description: 'ID'}))
    ID?: string
}

@SubModelMetaData()
export class SubAttachment extends SubModel {
    @FieldMetaData(new StringField({ Description: '储存名'}))
    FileName: string

    @FieldMetaData(new StringField({ Description: '文件名名称'}))
    OriginName: string

    @FieldMetaData(new StringField({ Description: '类型'}))
    MimeType: string

    @FieldMetaData(new StringField({ Description: '路径'}))
    Path: string
}

@ModelMetaData({
    ModelName: '供应商',
    ModelIcon: 'solution',
    IconColor: '#757575',
}
)
export class Supplier extends Model {
    @FieldMetaData(new StringField({ Description: '联系人'}))
    LinkManName: string

    @FieldMetaData(new StringField({ Description: '电话'}))
    Phone: string

    @FieldMetaData(new StringField({ Description: '公司名称'}))
    CompanyName: string

    @FieldMetaData(new ListField({ Description: '备注', IterType: Note }))
    Note: Note
}

@ModelMetaData({
    ModelName: '商品',
    ModelIcon: 'user',
    IconColor: '#757575',

})
export class Goods extends Model {
    @FieldMetaData(new StringField({ Description: '名称'}))
    Name: string

    @FieldMetaData(new AvatarField({ Description: '图片', IterType: SubAttachment}))
    Avatar: SubAttachment[]

    @FieldMetaData(new StringField({ Description: 'SKU'}))
    Number: string

    @FieldMetaData(new StringField({ Description: '颜色'}))
    Color: string

    @FieldMetaData(new StringField({ Description: '大小'}))
    Size: string

    @FieldMetaData(new NumberField({ Description: '重量'}))
    Weight: number

    @FieldMetaData(new NumberField({ Description: '单价'}))
    Price: number

    @FieldMetaData(new OtherDocField({ Description: '供应商', OtherType: Supplier}))
    Supplier: string
}


@ModelMetaData({
    ModelName: '表格配置',
    ModelIcon: 'setting',
    IconColor: '#757575'
})
export class TableColumnConfig extends Model {
    @FieldMetaData(new StringField({ Description: '名称'}))
    Name: string

    @FieldMetaData(new StringField({ Description: '应用名称'}))
    AppName: string;
}

@ModelMetaData({
    ModelName: '客户',
    ModelIcon: 'user',
    IconColor: '#757575'
})
export class Client extends Model {
    @FieldMetaData(new StringField({ Description: '名称'}))
    ContactName: string

    @FieldMetaData(new StringField({ Description: '手机'}))
    Mobile: string

    @FieldMetaData(new StringField({ Description: '公司名称'}))
    CompanyName: string

    @FieldMetaData(new StringField({ Description: '公司地址'}))
    Address: string

    @FieldMetaData(new ListField({ Description: '备注', IterType: Note }))
    Note: Note
}

@ModelMetaData({
    ModelName: '出货',
    ModelIcon: 'user',
    IconColor: '#757575'
})
export class Shipment extends Model {
    @FieldMetaData(new OtherDocField({ Description: '商品', OtherType: Goods}))
    Goods: Goods

    @FieldMetaData(new OtherDocField({ Description: '客户', OtherType: Client}))
    Client: Client

    @FieldMetaData(new ListField({ Description: '备注', IterType: Note }))
    Note: Note
}


@ModelMetaData({
    ModelName: '附件',
    ModelIcon: 'user',
    IconColor: '#757575',

})
export class Attachment extends Model {
    @FieldMetaData(new StringField({ Description: '储存名'}))
    FileName: string

    @FieldMetaData(new StringField({ Description: '文件名名称'}))
    OriginName: string

    @FieldMetaData(new StringField({ Description: '类型'}))
    MimeType: string

    @FieldMetaData(new StringField({ Description: '路径'}))
    Path: string
}





@SubModelMetaData()
export class DesktopPosition implements ISubModel {
    @FieldMetaData(new NumberField({ Description: 'X轴位置'}))
    X: number

    @FieldMetaData(new NumberField({ Description: 'Y轴位置'}))
    Y: number

    @FieldMetaData(new NumberField({ Description: '宽度'}))
    W: number

    @FieldMetaData(new NumberField({ Description: '高度'}))
    H: number
}


@ModelMetaData({
}
)
export class Desktop extends Model {
    @FieldMetaData(new StringField({ Description: '名称'}))
    Name: string

    @FieldMetaData(new ObjectField({ Description: '位置', Children: DesktopPosition }))
    Position: DesktopPosition

    @FieldMetaData(new StringField({ Description: '模型名'}))
    ModelName: string

    @FieldMetaData(new StringField({ Description: '模型桌面显示类型'}))
    ModelDesktopType: string
}


