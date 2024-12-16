import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-remote-controls',
  standalone: true,
  imports: [],
  templateUrl: './remote-controls.component.html',
  styleUrl: './remote-controls.component.css'
})
export class RemoteControlsComponent {


  constructor(
    private http: HttpService,
    private auth: AuthService,
    private swal: SwalService,
  ){
    
  }

  
}
