export namespace IAbility{
    export interface IList<T,K>{
        List(search:Object):Promise<Array<K>>
    }

    export interface IDetail<T,K>{
        Get(id:number):Promise<K>
    }

    export interface IAdd<T,K>{
        Add(doc:K):Promise<string>
        Update(id:string, query:{}, doc:K):Promise<string>
    }

    export interface IDelete<T>{
        Delete(id:number):Promise<boolean>
    }

    export interface IListAble<T,K>{
        ListServer:IList<T,K>
    }

    export interface IDetailAble<T,K>{
        DetailServer:IDetail<T,K>
    }

    export interface IAddAble<T,K>{
        AddServer:IAdd<T,K>
    }

    export interface IDeleteAble<T>{
        DeleteServer:IDelete<T>
    }
}
