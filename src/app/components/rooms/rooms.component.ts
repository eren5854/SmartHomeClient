import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){}

  get(){
    this.http.get("Rooms/GetAllByUserId", (res) => {
      console.log(res.data);
      
    })
  }
}
