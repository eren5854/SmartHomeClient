import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../../services/auth.service';
import { SensorModel } from '../../models/sensor.model';
import { Router, RouterLink } from '@angular/router';
import { RoomModel } from '../../models/room.model';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sensors.component.html',
  styleUrl: './sensors.component.css'
})
export class SensorsComponent {
  sensors: SensorModel[] = [];
  sensorModel: SensorModel = new SensorModel();
  selectedRoomId: string | null = null;
  rooms: RoomModel[] = [];

  sensorType: string[] = [
    "Other",
    "Light",
    "Relay",
    "Temperature",
    "Humidity",
    "Ldr",
    "Water",
    "Pressure",
    "Motion",
    "Speed"
  ]

  sensorTip?:string;

  constructor(
    private http: HttpService,
    private swal: SwalService,
    public auth: AuthService,
    private router: Router
  ){
    this.get();
    this.getRoom();
  }

  get(){
    this.http.get(`Sensors/GetAllSensorByUserId?Id=${this.auth.user.id}`, (res) => {
      this.sensors = res.data;
      console.log(res.data);
      
    })
  }

  create(form:NgForm){
    this.sensorModel.appUserId = this.auth.user.id!;   
    console.log(this.sensorTip);
     
    if(form.valid){
      this.http.post("Sensors/Create", this.sensorModel, (res) => {
        console.log(res.data);
        this.get();
      });
    }
  }
  
  getRoom() {
    this.http.get(`Rooms/GetAllByUserId?Id=${this.auth.user.id}`, (res) => {
      this.rooms = res.data;
      console.log(this.rooms);
    });
  }

  setRoomId(id: string) {
    this.selectedRoomId = id;
    this.sensorModel.roomId = id;
  }
}
