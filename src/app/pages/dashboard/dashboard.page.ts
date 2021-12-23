import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { CartService } from "../../services/cart.service";
import { AuthService } from "src/app/services/auth.service";
import { tap } from "rxjs/operators";
import { MenuController, NavController } from "@ionic/angular";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
    private cartService: CartService,
    private authService: AuthService,
    public menuCtrl: MenuController,
  ) {}
  stocks: any;
  sales: any;
  purchased: any;
  ngOnInit() {
    this.getRecords();
  }

   async ionViewWillEnter() {
    this.menuCtrl.enable(true);
   
  }
  
  doRefresh(event) {
    console.log("Begin async operation");
    this.getRecords();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  getRecords() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "dashboard", {
          headers: headers
        })
        .subscribe(
          data => {
            this.stocks = data["stocks"];
            this.sales = data["sales"];
            this.purchased = data["purchased"];
          },
          error => {
            console.log(error);
          }
        );
    });
  }
}
