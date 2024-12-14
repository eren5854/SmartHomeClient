import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../../services/auth.service';
import { SensorModel } from '../../models/sensor.model';
import { RoomModel } from '../../models/room.model';
import { SensorDataModel } from '../../models/sensor-data.model';
import * as signalR from '@microsoft/signalr';
import { SignalrService } from '../../services/signalr.service';
declare var Chartist: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  sensors: SensorModel[] = [];
  temps: SensorModel[] = [];
  lights: SensorModel[] = [];
  rooms: RoomModel[] = [];
  sensorDataModel: SensorDataModel = new SensorDataModel();

  hub: signalR.HubConnection | undefined;
  private intervalId: any;
  constructor(
    private http: HttpService,
    public auth: AuthService,
    private signalR: SignalrService,
  ) {
    this.get();
    this.getRoom();
    // this.hubContext();

    this.signalR.startConnection(() => {
      this.signalR.on('Lights', (res: SensorModel) => {
       this.getRoom();
       console.log(res);
       
        console.log("Güncellenen veya eklenen sensör verisi:", this.temps);
      });

      this.signalR.on('Temp', (res: SensorModel) => {
        this.get();
        // const existingSensorIndex = this.temps.findIndex(sensor => sensor.id === res.id);
      
        // if (existingSensorIndex !== -1) {
        //   // Mevcut sensörün verilerini güncelle, roomInfo.roomName'i koru
        //   this.temps[existingSensorIndex] = {
        //     ...this.temps[existingSensorIndex],
        //     ...res,
        //     roomInfo: {
        //       ...this.temps[existingSensorIndex].roomInfo,
        //       ...res.roomInfo,
        //       roomName: this.temps[existingSensorIndex].roomInfo?.roomName || res.roomInfo?.roomName || '',
        //       appUserId: res.roomInfo?.appUserId || 'default-app-user-id' // Varsayılan değer atanıyor
        //     }
        //   };
        // } else {
        //   // Eğer sensör dizide yoksa, yeni sensörü ekle
        //   this.temps.push(res);
        // }
      
        // console.log("Güncellenen veya eklenen sensör verisi:", this.temps);
      });
      
      
    });

    // this.intervalId = setInterval(() => {
    //   this.get();
    //   this.getRoom();
    // }, 3000);
  }

  get() {
    this.http.get(`Sensors/GetAllSensorByUserId?Id=${this.auth.user.id}`, (res) => {
      this.sensors = res.data;
      this.getTemps(this.sensors);
      this.getLights(this.sensors);
    });
  }

  getTemps(temps: SensorModel[]) {
    temps = temps.filter(sensor => sensor.sensorType === 3);
    this.temps = temps;
  }

  getLights(lights: SensorModel[]){
    lights = lights.filter(sensor => sensor.sensorType === 1);
    this.lights = lights;
  }

  getRoom() {
    this.http.get(`Rooms/GetAllByUserId?Id=${this.auth.user.id}`, (res) => {
      this.rooms = res.data;
      // this.rooms.forEach(room => {
      //   if (room.getAllSensor) {
      //     room.getAllSensor = room.getAllSensor.filter(sensor => sensor.sensorType === 1);
      //   }
      // });
    });
  }

  onToggleSwitch(sensor: SensorModel, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    sensor.data1 = isChecked ? 1 : 0; // data1 değerini güncelle
    this.updateSensorData(sensor); // API'yi çağır
  }

  updateSensorData(sensor: SensorModel) {
    // sensor.secretKey = this.auth.secretToken;
    this.http.post("Sensors/UpdateSensorData", sensor, (res) => {
      console.log('Sensör durumu güncellendi:', res.data);
    });
  }
}
