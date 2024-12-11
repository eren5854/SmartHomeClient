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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  lights: SensorModel[] = [];
  rooms: RoomModel[] = [];
  sensorDataModel: SensorDataModel = new SensorDataModel();

  constructor(
    private http: HttpService,
    public auth: AuthService,
    private swal: SwalService,
    private router: Router,
  ){
    this.get();
    this.getRoom();
  }

  get() {
    this.http.get(`Sensors/GetAllSensorByUserId?Id=${this.auth.user.id}`, (res) => {
      this.lights = res.data;
  
      this.lights = this.lights.filter(sensor => sensor.sensorType === 1);
      console.log('Sadece sensorType 1 olanlar:', this.lights);
    });
  }

  getRoom() {
    this.http.get(`Rooms/GetAllByUserId?Id=${this.auth.user.id}`, (res) => {
      this.rooms = res.data;
  
      this.rooms.forEach(room => {
        if (room.getAllSensor) {
          room.getAllSensor = room.getAllSensor.filter(sensor => sensor.sensorType === 1);
        }
      });
  
      console.log('SensorType 1 olanlar ile güncellenmiş odalar:', this.rooms);
    });
  }

  onToggleSwitch(sensor: SensorModel, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    sensor.data1 = isChecked ? 1 : 0; // data1 değerini güncelle
    this.updateSensorData(sensor); // API'yi çağır
  }
  
  updateSensorData(sensor: SensorModel) {
    this.http.post("Sensors/UpdateSensorData", sensor, (res) => {
      console.log('Sensör durumu güncellendi:', res.data);
    });
  }
}
