import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SensorModel } from '../../models/sensor.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomModel } from '../../models/room.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { LightTimeLogModel } from '../../models/light-time-log.model';

declare var $: any;

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements AfterViewInit {
  sensorId: string = "";
  sensorModel: SensorModel = new SensorModel();
  roomId: string = "";
  rooms: RoomModel[] = [];
  lightTimeLogs: LightTimeLogModel[] = [];
  selectedRoomId: string | null = null;
  total?:number;

  constructor(
    private http: HttpService,
    private swal: SwalService,
    public auth: AuthService,
    private activated: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard // Clipboard servisini enjekte ediyoruz
  ) {
    this.activated.params.subscribe((res) => {
      this.sensorId = res['id'];
    });
    this.get();
    this.getRoom();
    this.lightTimeLogTotal();
  }

  showSecretKey = false; // Secret Key'i göster/gizle durumu

  // Clipboard metodu
  copyToClipboard(value: string) {
    this.clipboard.copy(value); // CDK Clipboard kullanımı
    alert('Secret Key kopyalandı!');
  }

  get() {
    this.http.get(`Sensors/GetById?Id=${this.sensorId}`, (res) => {
      this.sensorModel = res.data;
      this.roomId = res.data.roomInfo.roomId;
      this.sensorModel.roomId = this.roomId;
      this.selectedRoomId = this.roomId;
      this.lightTimeLogs = res.data.lightTimeLogs;
      console.log(this.lightTimeLogs);
    });
  }

  lightTimeLogTotal(){
    for (let i = 0; i < this.lightTimeLogs.length; i++) {
      this.total =+ this.lightTimeLogs[i].timeCount!;
    }
    console.log(this.total);
    
  }

  update(form: NgForm) {
    console.log(this.sensorModel.roomId);
    if (form.valid) {
      this.http.post("Sensors/Update", this.sensorModel, (res) => {
        console.log(res.data);
        this.get();
      });
    }
  }

  setRoomId(id: string) {
    this.selectedRoomId = id;
    this.sensorModel.roomId = id;
  }

  deleteById() {
    this.swal.callToastWithButton('Silmek istediğinize emin misiniz?', 'Evet', () => {
      this.http.get(`Sensors/DeleteById?Id=${this.sensorId}`, (res) => {
        console.log(res.data);
        this.router.navigateByUrl("/sensors");
      });
    });
  }

  getRoom() {
    this.http.get(`Rooms/GetAllByUserId?Id=${this.auth.user.id}`, (res) => {
      this.rooms = res.data;
    });
  }

  generateSecretKey(){
    this.http.get(`Sensors/UpdateSecretKeyById?Id=${this.sensorModel.id}`, (res) => {
      console.log(res.data);
      this.swal.callToast2(res.data, 'info');
      this.get();
    })
  }

  ngAfterViewInit(): void {
    this.initializeFlotBarChart();
  }

  private initializeFlotBarChart(): void {
    const daysOfWeek = [
      [0.5, 'Pazartesi'], [2.5, 'Salı'], [4.5, 'Çarşamba'],
      [6.5, 'Perşembe'], [8.5, 'Cuma'], [10.5, 'Cumartesi'], [12.5, 'Pazar']
    ];

    $.plot("#flotBar1", [
      {
        data: [[0, 5], [2, 8], [4, 5], [6, 13], [8, 5], [10, 7], [12, 4]]
      }
    ], {
      series: {
        bars: {
          show: true,
          lineWidth: 0,
          fillColor: '#4dedf5'
        }
      },
      grid: {
        borderWidth: 1,
        borderColor: 'transparent'
      },
      yaxis: {
        tickColor: 'transparent',
        font: {
          color: '#f0a907',
          size: 12
        }
      },
      xaxis: {
        ticks: daysOfWeek,
        tickColor: 'transparent',
        font: {
          color: '#f0a907',
          size: 12
        }
      }
    });
  }
}
