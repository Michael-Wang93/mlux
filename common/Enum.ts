import "reflect-metadata";
import { Description } from "./erp";

export interface IEnum{

}

export class FieldTypeEnum implements IEnum{
    @Description('时间')
    static DateTime='DateTime'
    @Description('文本')
    static String='String'
    @Description('数字')
    static Number='Number'
    @Description('评分')
    static Rate='Rate'
    @Description('列表')
    static List='List'
    @Description('是否')
    static Switch='Switch'
    @Description('单选')
    static Radio='Radio'
    @Description('多选')
    static Select='Select'
    @Description('对象')
    static JObject='JObject'
    @Description('其他文档')
    static OtherDoc='OtherDoc'
    @Description('头像')
    static Avatar='Avatar'
}


export class EnumSexType implements IEnum{
    @Description('女士')
    static Formale='Formale'

    @Description('先生')
    static Male='Male'

    @Description('未知')
    static Unknow='Unknow'
}

export class EnumActionType implements IEnum{
    @Description('表格操作')
    static Table='Table'

    @Description('表格头部')
    static TableBar='TableBar'

    @Description('表格多选')
    static TableMass='TableMass'
}
