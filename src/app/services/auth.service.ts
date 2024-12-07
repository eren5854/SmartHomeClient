import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserModel = new UserModel();
  token: string = "";
  fullName: string = "";

  constructor(private router: Router) { }

  isAuthenticated(){
    const responseString: string | null = localStorage.getItem("loginToken");
    if (responseString != null) {
      try{
        this.token = responseString;
        const decode: JwtPayload | any = jwtDecode(this.token);
        const now: number = new Date().getTime()/1000;
        const exp: number | undefined = decode.exp;

        if (exp == undefined) {
          this.router.navigateByUrl("/login");
          return false;
        }

        if (exp < now) {
          this.router.navigateByUrl("/login");
          return false;
        }
        
        this.user.id = decode["Id"];
        console.log(this.user.id);
        
        this.user.email = decode["Email"];
        console.log(this.user.email);
        
        this.user.userName = decode["UserName"];
        console.log(this.user.userName);
        
        return true;
      }catch(error){
        console.warn(error);
        this.router.navigateByUrl("/login");
        return false;
      }
    }
    else{
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}
