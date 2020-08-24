import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  ActionSheetController,
  Platform,
  LoadingController,
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-point-history",
  templateUrl: "./point-history.page.html",
  styleUrls: ["./point-history.page.scss"],
})
export class PointHistoryPage implements OnInit {
  points: any;

  constructor(
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public menuCtrl: MenuController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPoints();
  }

  getPoints() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json",
      });
      this.http
        .get(this.env.API_URL + "points", {
          headers: headers,
        })
        .subscribe(
          (data) => {
            console.log(data["points"]);
            this.points = data["points"];
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }
}
