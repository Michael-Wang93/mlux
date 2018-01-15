import { AddConfig, AddConfigItem } from "../common/Models";

export let Config: {[key:string]:Array<AddConfigItem>} = {
    "Supplier":[
        {
            "Name": 'LinkManName',
            "Required": true,
        },
        {
            "Name": 'Phone',
            "Required": true
        },
        {
            "Name": 'CompanyName',
            "Required": true
        },
        {
            "Name": 'Note',
            "Meta": [
                {
                    "Name": "Comment",
                    "Required": true
                }
            ]
        }
    ],
    "Shipment":[
        {
            "Name": 'Goods',
            "Required": true,
        },
        {
            "Name": 'Client',
            "Required": true
        },
        {
            "Name": 'Note',
            "Meta": [
                {
                    "Name": "Comment",
                    "Required": true
                }
            ]
        }
    ],
    "Client":[
        {
            "Name": 'ContactName',
            "Required": true,
        },
        {
            "Name": 'Mobile',
            "Required": true
        },
        {
            "Name": 'CompanyName',
            "Required": true
        },
        {
            "Name": 'Address',
            "Required": true
        },
        {
            "Name": 'Note',
            "Meta": [
                {
                    "Name": "Comment",
                    "Required": true
                }
            ]
        }
    ],
    "Goods":[
        {
            "Name": 'Name',
            "Required": true,
        },
        {
            "Name": 'Avatar',
            "Required": true
        },
        {
            "Name": 'Number',
            "Required": true
        },
        {
            "Name": 'Color',
            "Required": true
        },
        {
            "Name": 'Size',
            "Required": true
        },
        {
            "Name": 'Weight',
            "Required": true
        },
        {
            "Name": 'Price',
            "Required": true
        },
        {
            "Name": 'Supplier',
            "Required": true
        }
    ]
}

 