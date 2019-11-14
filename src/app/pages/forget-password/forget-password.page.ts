import { Component, OnInit } from "@angular/core";
import {
  NavController,
  ToastController,
  LoadingController
} from "@ionic/angular";
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  formData = new FormData();
  nric: any;
  email: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }

  async submit() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    this.formData.append("email", JSON.stringify(this.email));
    this.formData.append("nric", JSON.stringify(this.nric));
    loader.present();
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .post(this.env.API_URL + "forget-password", this.formData, {
          headers: headers
        })
        .subscribe(
          data => {
            console.log(data);
            // loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: "Your Request has been Submitted!",
                duration: 3000,
                position: "bottom"
              });

              toast.present();
              this.navCtrl.navigateRoot("/");
            });
          },
          error => {
            console.log(error);
            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: "Your Update failed to Submmit!",
                duration: 3000,
                position: "bottom"
              });

              toast.present();
              this.navCtrl.navigateRoot("/");
            });
          }
        );
    });
  }



}
