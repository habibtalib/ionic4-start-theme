import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  myId = null;
  user : any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUser()
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "user/" + this.myId, {
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
