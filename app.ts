import * as express from 'express';
import {Response} from 'express/lib/response';
import {Request} from 'express/lib/request';
import * as bodyParser from 'body-parser';
import * as cookie from 'cookie-parser';
import * as multer from 'multer';
import * as fs from 'fs';
import * as reflect from 'reflect-metadata'
import {appController} from './Controllers/AppController'
import {Base} from './Api/Base'
import {ServerRegister} from './register'
import * as path from 'path'
import {initData} from './initData'
import { IAjax } from './common/erp'
import { ModelMeta } from "./Server/ModelMeta";
var upload = multer({ dest: '/opt/upload/' })

export class Server{
    private app:express.Express = express();

    private serverRegister =  new ServerRegister();

    public Run(){
        this.UseExpressMiddleware();
        this.UseRoute();
        this.Listen();
    }

    public UseExpressMiddleware(){
        this.app.use(bodyParser.json()); 
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use('/assets',express.static(path.join(__dirname, 'assets')));
        this.app.use(cookie());
    }

    public UseRoute(){
        this.UsePageRoute();
        this.UseApiRoute();
    }

    public UsePageRoute(){
        this.app.get(new RegExp('app/[a-zA-Z_]+'),async (request:Request, response:Response) => {
            var paths = request.path.split('/');
            var action = paths[2];
            var obj = new appController(request,response);
            await this.serverRegister.Run(obj,request,response,action,[]);
        });
    }

    public UseApiRoute(){
        this.app.all(new RegExp('rest/api'), async (request:Request, response:Response) => {
            let body:IAjax = request.body;
            var modelName:string = body.Collection;
            var action:string = body.Action;
            var params = body.Arguments;
            var obj = null;
            try{
                var nsc = require('./Api/' + modelName);
                var cls = nsc[modelName];
                obj = new cls(request,response);
            }catch(error){
                let model = await new ModelMeta().GetModelByCollectionName(modelName);
                obj = new Base(request,response,model);
            }
            await this.serverRegister.Run(obj,request,response,action,params);
        });
        this.app.post('/uploadfile', upload.any(), async (request:any,response)=>{
            var nsc = require('./Api/Attachment');
            var cls = nsc['Attachment'];
            var obj = new cls(request,response);
            await this.serverRegister.Run(obj,request,response,'Upload',[request.files]);
        })
        this.app.get(new RegExp('/preview/[.]*'), async (request:any,response)=>{
            var paths = request.path.split('/');
            var filepath = paths[2] || '';
            var nsc = require('./Api/Attachment');
            var cls = nsc['Attachment'];
            var obj = new cls(request,response);
            await this.serverRegister.Run(obj,request,response,'PreviewAvatar', [ decodeURIComponent(filepath)]);
        })
    }

    public Listen(){
        this.app.listen(3000);
    }
}

var run = async () => {
    await initData();
    new Server().Run();
}

run();
