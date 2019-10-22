import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"]
})
export class OrdersPage implements OnInit {
  orders: any;

  constructor(
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // this.getOrders();
  }

  ionViewWillEnter() {
    this.getOrders();
  }

  doRefresh(event) {
    console.log("Begin async operation");
    this.getOrders();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
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
        .get(this.env.API_URL + "order", {
          headers: headers
        })
        .subscribe(
          data => {
            this.orders = data["orders"];
            console.log(this.orders);
          },
          error => {
            console.log(error);
          }
        );
    });
  }
}
