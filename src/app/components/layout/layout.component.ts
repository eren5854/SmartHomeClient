import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';
import { TemplateSettingModel } from '../../models/template-setting.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  userName:string="";
  email:string="";
  fullName:string ="";

  activeMenu: string = '';

  templateSettingModel: TemplateSettingModel = new TemplateSettingModel();
  

  constructor(
    public auth: AuthService,
    private http: HttpService,
    private router: Router
  ){
    this.userName = auth.user.userName;
    this.email = auth.user.email;
    this.fullName = auth.user.fullName!;
    this.getTemplate();
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

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  getTemplate() {
    this.http.get(`TemplateSettings/GetByUserId?Id=${this.auth.user.id}`, (res) => {
      this.templateSettingModel = res.data;
      console.log(this.templateSettingModel);

      document.cookie = `containerLayout=${this.templateSettingModel.containerLayout!}; path=/; max-age=31536000;`;

      document.cookie = `layout=${this.templateSettingModel.version}; path=/; max-age=31536000;`;

      document.cookie = `version=${this.templateSettingModel.version!}; path=/; max-age=31536000;`;

      document.cookie = `headerPosition=${this.templateSettingModel.headerPosition!}; path=/; max-age=31536000;`;

      document.cookie = `sidebarPosition=${this.templateSettingModel.sidebarPosition!}; path=/; max-age=31536000;`;

      document.cookie = `sidebarStyle=${this.templateSettingModel.sidebarStyle!}; path=/; max-age=31536000;`;

      document.cookie = `typography=${this.templateSettingModel.typography!}; path=/; max-age=31536000;`;

      document.cookie = `headerBg=${this.templateSettingModel.headerBg!}; path=/; max-age=31536000;`;

      document.cookie = `navHeaderBg=${this.templateSettingModel.navHeaderBg!}; path=/; max-age=31536000;`;

      document.cookie = `sidebarBg=${this.templateSettingModel.sidebarBg!}; path=/; max-age=31536000;`;

      document.cookie = `primary=${this.templateSettingModel.primary!}; path=/; max-age=31536000;`;
    });
  }
  

  logout(){
    localStorage.setItem("loginToken", "");
    localStorage.setItem("hasReloaded", "");
    location.reload();
  }
}
