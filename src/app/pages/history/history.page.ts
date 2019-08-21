import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController } from "@ionic/angular";
import { CartService } from "../../services/cart.service";
import { AuthService } from 'src/app/services/auth.service';

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
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  orders: any;
  token: any;

  ngOnInit() {
    this.getOrders();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getOrders();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getOrders() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
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
    });
  }
}
