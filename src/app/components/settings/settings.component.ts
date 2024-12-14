import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChangePasswordModel } from '../../models/change-password.model';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  userModel: UserModel = new UserModel();
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  secretToken:string = "";
  constructor(
    private http: HttpService,
    public auth: AuthService,
    private router: Router,
    private clipboard: Clipboard
  ){
    this.userModel = auth.user;
    this.secretToken = auth.secretToken;
  }

  update(form:NgForm){
    // this.userModel.id = this.auth.user.id;
    if (form.valid) {
      this.http.post("Users/Update", this.userModel, (res) => {
        console.log(res.data);
        setTimeout(()=> {
          localStorage.clear();
          this.router.navigateByUrl("/login");
        },1000);
      })
    }
  }

  changePassword(form:NgForm){
    this.changePasswordModel.id = this.auth.user.id!;
    if (form.valid) {
      this.http.post("Auth/ChangePassword", this.changePasswordModel, (res) => {
        console.log(res.data);
        setTimeout(()=> {
          localStorage.clear();
          this.router.navigateByUrl("/login");
        },1000);
      })
    }
  }

  generateSecretToken(){
    this.http.get(`Users/UpdateSecretToken?Id=${this.auth.user.id}`, (res) => {
      setTimeout(()=> {
        localStorage.clear();
        this.router.navigateByUrl("/login");
      },1000);
    })
  }

  showSecretKey = false;
  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    alert('Secret Key kopyalandı!');
  }
}
