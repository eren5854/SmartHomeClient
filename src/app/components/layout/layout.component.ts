import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  userName:string="";
  email:string="";
  fullName:string ="";

  constructor(
    public auth: AuthService,
    private http: HttpService,
    private router: Router
  ){
    this.userName = auth.user.userName;
    this.email = auth.user.email;
    this.fullName = auth.user.fullName!;
    
  }

  ngOnInit() {
    // Yerel depolamada kontrol bayrağı
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      // Sayfa henüz yenilenmemişse yenile
      localStorage.setItem('hasReloaded', 'true');
      location.reload();
    }
  }

  logout(){
    localStorage.setItem("loginToken", "");
    localStorage.setItem("hasReloaded", "");
    location.reload();
  }
}
