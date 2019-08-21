import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user: any;
  formData = new FormData();

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
    ) { }

  ngOnInit() {
    this.getUser()
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "auth/user", {
          headers: headers
        })
        .subscribe(
          data => {
            this.user = data;
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    this.formData = new FormData();
    this.formData.append('user', JSON.stringify(this.user));
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .post(this.env.API_URL + "user/" + this.user.id, this.formData, { headers: headers })
        .subscribe(
          data => {
            loader.present();
            this.getUser()
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Update has Been Submmited!',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
              // this.navCtrl.navigateRoot('/home-results');
            });

          },
          error => {
            console.log(error);
            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Update failed to Submmit!',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        );
    });
  }
}
