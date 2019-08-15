import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController } from "@ionic/angular";

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

  themeCover = "assets/img/ionic4-Start-Theme-cover.jpg";
  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
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
            .get(this.env.API_URL + "merchandise", {
              headers: headers
            })
            .subscribe(
              data => {
                this.products = data["products"];
              },
              error => {
                console.log(error);
                this.products = [
                  {
                    name: "Meeracle Gemstone Cleanser",
                    image: "img/HMd6fBiAGfcOVUnVZeEyh6H9oUUfmqPPTnVDw3L9.jpeg",
                    price: 49,
                    product: {
                      price: 29.4,
                      quantity: 100,
                      active: null
                    }
                  }
                ];
              }
            );
        },
        error => {
          console.log("error", error);
        }
      );
  }

  notifications() {
    this.navCtrl.navigateForward("cart");
  }
}
