import {Response} from 'express/lib/response';
import {Request} from 'express/lib/request';
import {BaseController} from './BaseController';
import { AuthorizeTypeEnum, Authorize } from '../Interface/IAuthorize';
import "reflect-metadata";
import {Template as AppTpl} from '../View/app/app'
import { Setting } from '../common/Models'
import fetch from 'node-fetch'
import { ModelMeta } from "../Server/ModelMeta";
import { IModelMeta } from "../Interface/IModelMeta";

export class appController extends BaseController{
    private static BackgroundImage:string;

    private  ModelMetaServer:IModelMeta = new ModelMeta()

    constructor(request:Request, response:Response){
        super(request,response);
    }

    @Authorize(AuthorizeTypeEnum.Anyone)
    public async index(){
        if(!appController.BackgroundImage){
            var backgroundJson = await fetch("http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1");
            var json = await backgroundJson.json();
            var url = "http://cn.bing.com" + json.images[0].url;
            appController.BackgroundImage = url;
        }
        var setting = new Setting();
        var models = await this.ModelMetaServer.GetModels();
        var submodels = await this.ModelMetaServer.GetSubModels();
        setting.BackgroundImage = appController.BackgroundImage;
        setting.MainColor = 'rgb(41,143,204)';
        var content = `<div id="app" style="display: flex; height:100%">
        </div>`;
        var script = {
            Models:models,
            Setting: setting,
            User: this.User,
            SubModels: submodels
        };
        return new AppTpl(script,'',content).init();
    }
}