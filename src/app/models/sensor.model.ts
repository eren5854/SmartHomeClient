export class SensorModel{
    id?:string;
    sensorName: string = "";
    description?: string;
    sensorType?: number;
    serialNo?: string;
    secretKey?: string;
    status?:string;
    data1:number = 0;
    data2?:number;
    data5?:string;
    appUserId: string = "";
    roomId?:string;
    createdDate:any;
}