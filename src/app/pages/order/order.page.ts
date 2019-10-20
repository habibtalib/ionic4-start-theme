import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";

import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  ActionSheetController,
  Platform, LoadingController
} from '@ionic/angular';
@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  orders: any;
  myId: any;
  formData = new FormData();

  constructor(
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    private toastController: ToastController,
    private photoViewer: PhotoViewer,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getOrders();
  }

  showPreview(){
    this.photoViewer.show(
      "http://api.meeracle.ml/storage/" + this.orders.payment_slip
    );
  }

  async update(status) {
    const loader = await this.loadingController.create({
      duration: 2000
    });
    this.formData = new FormData();
    this.formData.append("status", status);
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .post(this.env.API_URL + "order/" + this.myId, this.formData, {
          headers: headers
        })
        .subscribe(
          data => {
            console.log(data);
            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastController.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: "Your Order has Been Submmited!",
                duration: 3000,
                position: "bottom"
              });

              toast.present();
              this.getOrders();
              // this.navCtrl.navigateRoot('/home-results');
            });
          },
          error => {
            console.log(error);
            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastController.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: "Your Order failed to Submmit!",
                duration: 3000,
                position: "bottom"
              });

              toast.present();
              this.getOrders();
              // this.navCtrl.navigateRoot('/home-results');
            });
          }
        );
    });
  }

  getOrders() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "order/" + this.myId, {
          headers: headers
        })
        .subscribe(
          data => {
            this.orders = data["order"];
            console.log(this.orders);
          },
          error => {
            console.log(error);
          }
        );
    });
  }
}
