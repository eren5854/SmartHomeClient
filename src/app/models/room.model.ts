import { SensorModel } from "./sensor.model";

export class RoomModel{
    id?:string;
    roomName:string ="";
    roomDescription?:string;
    appUserId:string="";
    getAllSensor?: SensorModel[]
}