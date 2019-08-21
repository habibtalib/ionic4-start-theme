import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController } from "@ionic/angular";
import { CartService } from "../../services/cart.service";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-merchandise",
  templateUrl: "./merchandise.page.html",
  styleUrls: ["./merchandise.page.scss"]
})
export class MerchandisePage implements OnInit {
  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };
  products: any;
  token: any;
  cart = [];

  themeCover = "assets/img/ionic4-Start-Theme-cover.jpg";
  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.getProducts();
  }

  addToCart(product) {
    this.cartService.addProduct(product);
  }

  getProducts() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "merchandise", {
          headers: headers
        })
        .subscribe(
          data => {
            this.products = data["products"];
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  notifications() {
    this.navCtrl.navigateForward("cart");
  }
}
