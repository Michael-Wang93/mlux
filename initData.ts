import { Model } from './common/Models'
import { Authorize } from "./Server/Authorize";
import * as mongo from 'mongodb'
import { Db } from 'mongodb'
import * as minimist from 'minimist'

export var code:string = null;

export var db:Db = null;

export var initArgs = () => {
     var args = minimist(process.argv.slice(2));
     code = args.code;
}

export var initDbConnection = async () => {
    var mongoClient = mongo.MongoClient
    var url = 'mongodb://localhost:27017/' + code;
    var connection = await mongoClient.connect(url);
    return connection;
}

export var initAdmin = async () => {
    new Authorize().Registe('admin','admin');
}

export var initData = async () => {
    initArgs();
    db = await initDbConnection();
    initAdmin();
}