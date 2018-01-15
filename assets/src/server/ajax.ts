import { Observable }  from 'rxjs'
import { IModelMetaData } from "../../../common/Models";
import { IAjax } from "../../../common/erp";


export function fetch$(collection:string, action:string, args?: Array<any>) {
    return Observable.ajax.post(
        '/rest/api',
        JSON.stringify({
            Collection:collection,
            Action:action,
            Arguments:args
        }),
        {'Content-Type':'application/json'}).map((ret)=>{
            return ret.response.result;
    })
}

export async function Asyncfetch(collection:string, action:string, args?: Array<any>) {
    return Observable.ajax.post(
        '/rest/api',
        JSON.stringify({
            Collection:collection,
            Action:action,
            Arguments:args
        }),
        {'Content-Type':'application/json'}).map((ret)=>{
            return ret.response.result;
    }).toPromise();
}


export async function Sync<T>(collection:string, action:string, args?: Array<any>) {
    return Observable.ajax.post(
        '/rest/api',
        JSON.stringify({
            Collection:collection,
            Action:action,
            Arguments:args
        }),
        {'Content-Type':'application/json'}).map((ret)=>{
            return ret.response.result;
    }).toPromise<T>();
}

export async function UploadFile(collection:string, action:string, args?: Array<any>) {
    return Observable.ajax.post(
        '/rest/api',
        JSON.stringify({
            Collection:collection,
            Action:action,
            Arguments:args
        }),
        {'Content-Type':'multipart/form-data'}).map((ret)=>{
            return ret.response.result;
    }).toPromise();
}