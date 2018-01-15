
import { WindowHander } from "../base/base";
import { ITask } from "../../models/window";
import { Server as ApplicationServer } from '../../server/application'
import { Server as ExcelImportServer } from '../../server/excelimport'
import View from '../../view/excelimport/main'

export namespace Controller {
    @ApplicationServer.Application.RegisterApplication({
        Order: 4,
        AppName: 'ExcelImport',
        Name: 'Excel导入',
        IconName: 'cloud-upload-o',
        ShowType: 'List',
        Command: "ExcelImport"
    })
    export class ExcelImportController extends WindowHander {
        public BackgroundColor = 'white'

        public Width = '500px'

        public Height = '500px'

        constructor(task: ITask) {
            super(task)
        }

        async InitView() {
            let models = ExcelImportServer.ExcelImport.GetImportAbleModels();
            return View({
                Models: models,
                OnSubmit: (value) => ExcelImportServer.ExcelImport.Import(value)
            });
        }
    }
}