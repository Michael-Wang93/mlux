import { Server as TableServer } from '../../../server/table'
import { EnumActionType } from "../../../../../common/Enum";
import { IModelMetaData } from "../../../../../common/Models";
import Message from "../../../widgets/search";

export let adhocmap:Map<string,Partial<TableServer.ITableColumn>>=new Map()

