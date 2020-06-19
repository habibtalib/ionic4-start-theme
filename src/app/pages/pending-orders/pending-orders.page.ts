import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.page.html',
  styleUrls: ['./pending-orders.page.scss'],
})
export class PendingOrdersPage implements OnInit {
  orders = [];
  currentPage: any;
  
  constructor(
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.currentPage = 1;
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
        .get(this.env.API_URL + "pending-order", {
          headers: headers
        })
        .subscribe(
          data => {
            data["orders"].data.forEach((d) => { this.orders.push(d) });
            console.log(this.orders);
          },
          error => {
            console.log(error);
          }
        );
    });
  }

}
