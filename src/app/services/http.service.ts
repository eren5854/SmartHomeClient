import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // imageUrl:string = "https://localhost:7023/Images/";
  // url:string = "https://localhost:7023/api/"
  // url:string = "http://192.168.68.134:54010/api/";
  url:string = "https://smartbuildapi.erendelibas.xyz/api/"
   constructor(
     private http: HttpClient,
     private auth: AuthService,
     private swal: SwalService
   ){}
 
  //  getImageUrl(){
  //    return this.imageUrl;
  //  }
 
   get(api: string, callBack: (res:any) => void){
     this.http.get(`${this.url}${api}`, {
       headers: {
         "Authorization": "Bearer " + this.auth.token
       }
     }).subscribe({
       next: (res: any) => {
         callBack(res);
       },
       error: (err: HttpErrorResponse) => {
         if (!err.error.isSuccess) {
           console.log(err.error.errorMessages);
         }
         else{
           console.log(err);
         }
       }
     });
   }
   
   post(api: string, body:any,callBack: (res:any)=> void) {
     this.http.post(`${this.url}${api}`,body, {
       headers: {
         "Authorization": "Bearer " + this.auth.token
       }
     }).subscribe({
       next: (res: any) => {
         callBack(res);
         this.swal.callToast2(res.data, 'success');
       },
       error: (err: HttpErrorResponse) => {
         if (!err.error.isSuccess) {
           console.log(err.error.errorMessages);
           console.log(err.error.errors);
           
           this.swal.callToast(err.error.errorMessages[0], 'warning');
         }
         else{
           console.log(err);
         }
       }
     });
   }
}
