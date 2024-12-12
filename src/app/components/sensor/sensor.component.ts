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
  total?: number;
  data: any;

  constructor(
    private http: HttpService,
    private swal: SwalService,
    public auth: AuthService,
    private activated: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard
  ) {
    this.activated.params.subscribe((res) => {
      this.sensorId = res['id'];
    });
    this.get();
    this.getRoom();
    this.lightTimeLogTotal();
    this.getLightTimeLogDaily();
    this.getLightTimeLogWeekly();
  }

  showSecretKey = false;
  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    alert('Secret Key kopyalandı!');
  }

  get() {
    this.http.get(`Sensors/GetById?Id=${this.sensorId}`, (res) => {
      this.sensorModel = res.data;
      this.roomId = res.data.roomInfo.roomId;
      this.sensorModel.roomId = this.roomId;
      this.selectedRoomId = this.roomId;
      this.lightTimeLogs = res.data.lightTimeLogs;
    });
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

  generateSecretKey() {
    this.http.get(`Sensors/UpdateSecretKeyById?Id=${this.sensorModel.id}`, (res) => {
      console.log(res.data);
      this.swal.callToast2(res.data, 'info');
      this.get();
    })
  }

  getLightTimeLogDaily() {
    this.http.get(`LightTimeLogs/GetAllBySensorIdDaily?Id=${this.sensorId}`, (res) => {
      this.lightTimeLogs = res.data;
      console.log(this.lightTimeLogs);
      this.LineChart(this.lightTimeLogs);
    });
  }

  getLightTimeLogWeekly() {
    this.http.get(`LightTimeLogs/GetDailyTotalsBySensorIdWeekly?Id=${this.sensorId}`, (res) => {
      const data = res.data;
      console.log(res.data);
      

      // data'nın türünü kontrol edelim
      if (!Array.isArray(data)) {
        // data bir dizi değilse, nesneyi diziye dönüştürelim
        const dataArray = Object.entries(data).map(([date, value]) => ({
          date,
          value: Number(value) // Burada value'yu number tipine çeviriyoruz
        }));

        // Günlerin sıralarını belirleyelim (Pazartesi=0, Salı=1, ... Pazar=6)
        const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

        // Veriyi formatlayalım
        const formattedData = dataArray.map((item) => {
          const dayIndex = new Date(item.date).getDay() - 1; // -1 yaparak günü sıfırdan başlatırız (Pazartesi=0)
          const minutes = item.value / 60; // Saniyeden dakikaya çevirme
          return [dayIndex * 2, minutes]; // 0, 2, 4, 6, 8, 10, 12 gibi artan index
        });

        this.initializeFlotBarChart(formattedData);
      } else {
        // Eğer data zaten bir dizi ise, direkt formatlayalım
        const formattedData = data.map((item) => {
          const dayIndex = new Date(item.date).getDay() - 1; // -1 yaparak günü sıfırdan başlatırız (Pazartesi=0)
          const minutes = Number(item.value) / 60; // value'yu number tipine çevirme ve saniyeden dakikaya çevirme
          return [dayIndex * 2, minutes]; // 0, 2, 4, 6, 8, 10, 12 gibi artan index
        });

        this.initializeFlotBarChart(formattedData);
      }
    });
  }

  lightTimeLogTotal() {
    for (let i = 0; i < this.lightTimeLogs.length; i++) {
      this.total = + this.lightTimeLogs[i].timeCount!;
    }
    console.log(this.total);

  }

  ngAfterViewInit(): void {
    // this.initializeFlotBarChart(formattedData);
    this.LineChart(this.lightTimeLogs);
  }

  private initializeFlotBarChart(data: any[]): void {
    const daysOfWeek = [
      [0.5, 'P'], [2.5, 'S'], [4.5, 'Ç'],
      [6.5, 'P'], [8.5, 'C'], [10.5, 'C'], [12.5, 'P']
    ];

    $.plot("#flotBar1", [
      {
        // data: [[0, 5], [2, 8], [4, 5], [6, 13], [8, 5], [10, 7], [12, 4]]
        data: data
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

  private LineChart(data: LightTimeLogModel[]): void {
    const plotData = data
      .filter(log => log.finishDate && log.timeCount !== undefined)
      .map((log, index) => {
        const finishDate = new Date(log.finishDate);
        const hours = finishDate.getHours();
        const minutes = finishDate.getMinutes();
        const timeInHours = hours + minutes / 60;
        return [timeInHours, log.timeCount as number];
      });
  
    $.plot($('#flotLine1'), [
      {
        data: plotData,
        label: 'Time Count',
        color: '#ffaa2b'
      }
    ],
    {
      series: {
        lines: {
          show: true,
          lineWidth: 1
        },
        shadowSize: 0
      },
      points: {
        show: false,
      },
      legend: {
        noColumns: 1,
        position: 'nw'
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderColor: '#ddd',
        borderWidth: 0,
        labelMargin: 5,
        backgroundColor: 'transparent'
      },
      yaxis: {
        min: 0,
        max: Math.max(...data.map(log => log.timeCount ?? 0)) + 5,
        color: 'transparent',
        font: {
          size: 10,
          color: '#999'
        }
      },
      xaxis: {
        tickDecimals: 1,
        tickSize: 1,
        color: 'transparent',
        font: {
          size: 10,
          color: '#999'
        }
      }
    });
  }
  
}