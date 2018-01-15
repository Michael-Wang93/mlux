import { IAbility } from '../Interface/IAbility'
import { IModel, IModelMetaData } from "../common/Models";
import { db } from "../initData";
import { ObjectID } from 'bson'


export namespace Alibity{
    class BaseServer<T extends IModelMetaData>{
        public model:T;

        constructor(model:T){
            this.model = model;
        }

        async getConnection(){
            var collection = db.collection(this.model.CollectionName);
            return collection;
        }
    }

    export class ListServer<T extends IModelMetaData,K extends IModel> extends BaseServer<T> implements IAbility.IList<T,K>{
        constructor(model:T){
            super(model);
        }

        async List(query:object):Promise<Array<K>>{
            var collection = await this.getConnection()
            var result = await collection.find(query).toArray();
            if(result && result.length){
                return result as Array<K>;
            }
            return [];
        }
    }

    export class DetailServer<T extends IModelMetaData,K extends IModel> extends BaseServer<T> implements IAbility.IDetail<T,K>{
        constructor(model:T){
            super(model);
        }

        async Get(id:number):Promise<K>{
            var collection = await this.getConnection()
            var result = await collection.findOne({id:id});
            if(result){
                return result as K;
            }
            return {} as K;
        }
    }

    export class DeleteServer<T extends IModelMetaData> extends BaseServer<T> implements IAbility.IDelete<T>{
        constructor(model:T){
            super(model);
        }

        async Delete(id:number):Promise<boolean>{
            var collection = await this.getConnection()
            var result = await collection.deleteOne({'_id':new ObjectID(id)});
            if(result.deletedCount === 1){
                return true;
            }
            return false;
        }
    }

    export class AddServer<T extends IModelMetaData,K extends IModel> extends BaseServer<T> implements IAbility.IAdd<T,K>{
        constructor(model:T){
            super(model);
        }

        async Add(doc:K):Promise<string>{
            let id = doc._id;
            let collection = await this.getConnection()
            let result:any = null;
            result = await collection.insertOne(doc);
            if(result.insertedId){
                return result.insertedId.toString();
            }
            return null;
        }

        async Update(id:string, query:any, doc:K):Promise<string>{
            if(!query || !id){
                return null;
            }
            if(id){
                query._id = new ObjectID(id);
            }
            let collection = await this.getConnection()
            let result:any = null;
            result = await collection.updateOne(query, doc)
            if(result && result.upsertedId && result.upsertedId._id){
                return result.upsertedId._id.toString();
            }
            return null;
        }
    }
}