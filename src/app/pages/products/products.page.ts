import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { CartService } from "../../services/cart.service";
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import {
  NavController
} from '@ionic/angular';

@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"]
})
export class ProductsPage implements OnInit {
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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.getProducts();
  }

  doRefresh(event) {
    console.log("Begin async operation");
    this.getProducts();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  addToCart(product) {
    this.cartService.addProduct(product);
  }

  getProducts() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "products", {
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
    // this.http
    //   .post(this.env.API_URL + "auth/login", {
    //     email: "cyberx11@gmail.com",
    //     password: "tydfhq78"
    //   })
    //   .subscribe(
    //     token => {
    //       this.token = token["access_token"];
    //       const headers = new HttpHeaders({
    //         Authorization: "Bearer " + this.token,
    //         Accept: "application/json"
    //       });
    //       this.http
    //         .get(this.env.API_URL + "products", {
    //           headers: headers
    //         })
    //         .subscribe(
    //           data => {
    //             this.products = data["products"];
    //           },
    //           error => {
    //             console.log(error);
    //           }
    //         );
    //     },
    //     error => {
    //       console.log("error", error);
    //     }
    //   );
  }

  notifications() {
    this.navCtrl.navigateForward("cart");
  }
}
