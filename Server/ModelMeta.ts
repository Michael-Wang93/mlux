import { IModelMeta } from "../Interface/IModelMeta";
import { IModelMetaData, Models, SubModels, CustomObject as CustomObjectModel, ISubModelMetaData } from "../common/Models";
import { db } from "../initData";
import { CustomObject } from '../Api/CustomObject'
import { IFieldMeta } from "../common/Field";

export class ModelMeta implements IModelMeta {
    private InitObjectTree(buildIn:IModelMetaData, custom:IModelMetaData):IModelMetaData{
        buildIn.IconColor = custom.IconColor;
        buildIn.ModelIcon = custom.ModelIcon;
        buildIn.ModelName = custom.ModelName;
        for(let i of custom.Fields){
            let buildField = buildIn.Fields.find((x:IFieldMeta)=>{ return x.Name === i.Name});
            if(buildField){
                this.MergeField(buildField, i);
            }
        }
        return buildIn;
    }

    private InitSubObjectTree(buildIn:ISubModelMetaData, custom:ISubModelMetaData):IModelMetaData{
        for(let i of custom.Fields){
            let buildField = buildIn.Fields.find((x:IFieldMeta)=>{ return x.Name === i.Name});
            if(buildField){
                this.MergeField(buildField, i);
            }
        }
        return buildIn;
    }

    private MergeField(buildIn:IFieldMeta, custom:IFieldMeta){
        buildIn.Description = custom.Description;
        buildIn.ValueEnum = custom.ValueEnum;
        if(buildIn.Childable){
             buildIn.Children = this.InitSubObjectTree(buildIn.Children,custom.Children);
        }
    }
    async GetSubModels(): Promise<ISubModelMetaData[]> {
        let map:Map<string,ISubModelMetaData> = Models;
        let ret:ISubModelMetaData[] = [];
        for(let i of map.values()){
            ret.push(i)
        }
        return ret;
    }

    async GetModels(): Promise<IModelMetaData[]> {
        let customObjects = await CustomObject.Find<IModelMetaData>().toArray();
        let map:Map<string,IModelMetaData> = Models;
        for (let i of customObjects){
            if(Models.has(i.CollectionName)){
                map.set(i.CollectionName,this.InitObjectTree(Models.get(i.CollectionName), i));
            }
        }
        let ret:IModelMetaData[] = [];
        for(let i of map.values()){
            ret.push(i)
        }
        return ret;
    }

    async GetModelByCollectionName(collectionName:string): Promise<IModelMetaData> {
        let customObjects = await CustomObject.Find<IModelMetaData>().toArray();
        let customObject = customObjects.find((x:IModelMetaData)=>{
            return x.CollectionName === collectionName;
        });
        if(!customObject){
            return Models.get(collectionName);
        }
        return customObject;
    }
}

