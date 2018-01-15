import { TableColumnConfig } from "../common/Models";

export let Config: {[key:string]:Array<Partial<TableColumnConfig>>} = {
    "User":[
        {
            "Name": 'Name',
            "AppName": 'User',
            "_id": null
        },
        {
            "Name": 'Mobile',
            "AppName": 'User',
            "_id": null
        }
    ],
    "Client":[
        {
            "Name": 'ContactName'
        },
        {
            "Name": 'Mobile'
        },
        {
            "Name": 'CompanyName'
        },
        {
            "Name": 'Address'
        },
        {
            "Name": 'Note'
        }
    ],
    "Shipment":[
        {
            "Name": 'Goods'
        },
        {
            "Name": 'Client'
        },
        {
            "Name": 'Note'
        }
    ],
    "Supplier":[
        {
            "Name": 'LinkManName'
        },
        {
            "Name": 'Phone'
        },
        {
            "Name": 'CompanyName'
        },
        {
            "Name": 'Note'
        }
    ],
    "Goods":[
        {
            "Name": 'Name'
        },
        {
            "Name": 'Avatar'
        },
        {
            "Name": 'Number'
        },
        {
            "Name": 'Color'
        },
        {
            "Name": 'Size'
        },
        {
            "Name": 'Weight'
        },
        {
            "Name": 'Price'
        },
        {
            "Name": 'Supplier'
        }
    ]
}

 