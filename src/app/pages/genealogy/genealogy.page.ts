import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: "app-genealogy",
  templateUrl: "./genealogy.page.html",
  styleUrls: ["./genealogy.page.scss"]
})
export class GenealogyPage implements OnInit {
  user: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // this.getUser();
  }
  
  ionViewWillEnter() {
    this.getUser();
  }

  getClass(item) {
    console.log(item);
    return "class-diamond";
  }

  navUser(user) {
    console.log("user", user);
    this.navCtrl.navigateForward("/user", user.id);
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
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
}
