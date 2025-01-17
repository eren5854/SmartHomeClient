import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../../services/auth.service';
import { RoomModel } from '../../models/room.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'] // Düzeltme: styleUrl -> styleUrls
})
export class RoomsComponent {
  rooms: RoomModel[] = [];
  roomModel:RoomModel = new RoomModel();
  roomSensorCounts: { roomName: string; sensorCount: number }[] = []; // Odaların sensör sayıları

  iconColors: string[] = [
    'text-primary bgl-primary',
    'text-success bgl-success',
    'text-danger bgl-danger',
    'text-warning bgl-warning',
    'text-info bgl-info',
    'text-secondary bgl-secondary',
    'text-dark bgl-dark',
    'text-light bgl-light',
    'text-muted bgl-muted',
    'text-teal bgl-teal',
  ];
  

  constructor(
    private http: HttpService,
    private swal: SwalService,
    public auth: AuthService
  ) {
    this.get();
  }

  get() {
    this.http.get(`Rooms/GetAllByUserId?Id=${this.auth.user.id}`, (res) => {
      this.rooms = res.data;
      console.log(this.rooms);

      // Her oda için sensör sayısını hesapla
      this.roomSensorCounts = this.rooms.map((room) => ({
        roomName: room.roomName,
        sensorCount: room.getAllSensor!.length || 0,
      }));

      console.log('Room Sensor Counts:', this.roomSensorCounts);
    });
  }

  create(form:NgForm){
    if (form.valid) {
      this.roomModel.appUserId = this.auth.user.id!;
      this.http.post("Rooms/Create", this.roomModel, (res) => {
        console.log(res.data);
        this.get();
        this.swal.callToast2(res.data, 'success');
      }); 
    }
  }
}
