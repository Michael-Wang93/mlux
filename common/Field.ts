import { IEnum, FieldTypeEnum } from "./Enum";
import { IModel, Model, ISubModel, IModelMetaData, SubModels, ISubModelMetaData, ModelOrFieldType } from "./Models";
import { DescriptionKey } from "./erp";

export interface IValueEnumItem{
    Label:string, Value:string
}

export interface IFieldMeta {
    Name:string
    Description:string
    Buildin:boolean
    Children?:ISubModelMetaData
    Childable:boolean
    Iterable:boolean
    IterType?:ISubModelMetaData
    ValueEnum:Array<IValueEnumItem>
    Enumable:boolean;
    ViewType: string
    OtherType?:string
    Type:string
}


export class Field implements IFieldMeta {
    ViewType= '';
    Childable=false;
    Iterable=false;
    Enumable=false;
    ValueEnum:Array<IValueEnumItem>=[];
    Children:ISubModelMetaData;
    Name: string;
    Description: string;
    Buildin=true;
    Type=ModelOrFieldType.Field.toString()
}

export class StringField extends Field{
    Childable=false
    Iterable=false
    Enumable=false
    constructor(param:{Description:string,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.String;
        this.Description = param.Description;
    }
}

export class NumberField extends Field{
    Childable=false
    Iterable=false
    Enumable=false
    constructor(param:{Description:string,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.Number;
        this.Description = param.Description;
    }
}

export class DateTimeField extends Field{
    Childable=false
    Iterable=false
    Enumable=false
    constructor(param:{Require:boolean,Description:string,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.DateTime;
        this.Description = param.Description;
    }
}

export class BooleanField extends Field{
    Childable=false
    Iterable=false
    Enumable=false
    constructor(param:{Description:string,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.Switch;
        this.Description = param.Description;
    }
}

export class RadioField extends Field{
    Childable=false
    Iterable=false
    Enumable=true
    constructor(param:{Description:string,ValueEnum:IEnum,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.Radio;
        this.ValueEnum = Object.keys(param.ValueEnum).map((item:string)=>{
            let desc = Reflect.getMetadata(DescriptionKey,param.ValueEnum,item);
            return {Value:item,Label:desc};
        });
        this.Description = param.Description;
    }
}

export class SelectField extends Field{
    Childable=false
    Iterable=false
    Enumable=true
    constructor(param:{Description:string,ValueEnum:IEnum,ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.Select;
        this.ValueEnum = Object.keys(param.ValueEnum).map((item:string)=>{
            let desc = Reflect.getMetadata(DescriptionKey,param.ValueEnum,item);
            return {Value:item,Label:desc};
        });
        this.Description = param.Description;
    }
}

export class ObjectField extends Field{
    Childable=true
    Iterable=false
    Enumable=false
    constructor(param:{Description:string,Children:{new(): ISubModel},ViewType?:string}) {
        super();
        this.Children = SubModels.get(param.Children.name);
        this.ViewType=param.ViewType || FieldTypeEnum.JObject;
        this.Description = param.Description;
    }
}

export class ListField extends Field{
    Childable=false
    Iterable=true
    IterTypeName:string
    IterType:ISubModelMetaData
    Enumable=false
    constructor(param:{Description:string,IterType?:{new(): IModel | ISubModel},ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.List;
        this.IterTypeName=param.IterType && param.IterType.name;
        this.IterType = SubModels.get(this.IterTypeName);
        this.Description = param.Description;
    }
}

export class AvatarField extends Field{
    Childable=false
    Iterable=true
    IterTypeName:string
    IterType:ISubModelMetaData
    Enumable=false
    constructor(param:{Description:string,IterType?:{new(): IModel | ISubModel},ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.Avatar;
        this.IterTypeName=param.IterType && param.IterType.name;
        this.IterType = SubModels.get(this.IterTypeName);
        this.Description = param.Description;
    }
}

export class OtherDocField extends Field{
    Childable=false
    Iterable=false
    OtherType:string
    Enumable=false
    constructor(param:{Description:string,OtherType?:{new(): IModel},ViewType?:string}) {
        super();
        this.ViewType=param.ViewType || FieldTypeEnum.OtherDoc;
        this.OtherType=param.OtherType && param.OtherType.name;
        this.Description = param.Description;
    }
}
