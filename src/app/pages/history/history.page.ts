import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController } from "@ionic/angular";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.page.html",
  styleUrls: ["./history.page.scss"]
})
export class HistoryPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
    private cartService: CartService
  ) {}

  orders: any;
  token: any;

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.http
      .post(this.env.API_URL + "auth/login", {
        email: "cyberx11@gmail.com",
        password: "tydfhq78"
      })
      .subscribe(
        token => {
          this.token = token["access_token"];
          const headers = new HttpHeaders({
            Authorization: "Bearer " + this.token,
            Accept: "application/json"
          });
          this.http
            .get(this.env.API_URL + "history", {
              headers: headers
            })
            .subscribe(
              data => {
                this.orders = data["orders"];
                console.log(this.orders)
              },
              error => {
                console.log(error);
              }
            );
        },
        error => {
          console.log("error", error);
        }
      );
  }
}
