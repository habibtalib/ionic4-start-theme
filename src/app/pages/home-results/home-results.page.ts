import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from "@ionic/angular";

// Modals
// import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from "./../modal/image/image.page";
// Call notifications test by Popover and Custom Component.
// import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RegisterPage } from "../register/register.page";
import { LoginPage } from "../login/login.page";
import { AuthService } from "src/app/services/auth.service";
import { CartService } from "../../services/cart.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-home-results",
  templateUrl: "./home-results.page.html",
  styleUrls: ["./home-results.page.scss"]
})
export class HomeResultsPage {
  searchKey = "";
  yourLocation = "123 Test Street";
  themeCover = "assets/img/ionic4-Start-Theme-cover.jpg";

  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };
  masterStockist: any;
  user: any;

  cart = [];
  token: any;
  // @ViewChild('mySlider') slider: Slides;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient,
    private env: EnvService,
    private store: Storage
  ) {}

  ionViewWillEnter() {
    this.cart = this.cartService.getCart();
    this.geSlides();
    this.getUser();
    this.authService.getToken().then(() => {
      console.log("isLoggedin", this.authService.isLoggedIn);
      if (!this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot("/");
      }
    });
    this.menuCtrl.enable(true);
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "auth/user", {
          headers: headers
        })
        .subscribe(
          data => {
            this.user = data;
            console.log(this.user);
            this.checkVerified();
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  doRefresh(event) {
    console.log("Begin async operation");
    this.geSlides();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {}

  settings() {
    this.navCtrl.navigateForward("settings");
  }

  async checkVerified() {
    if (!this.user.active) {
      if (!this.user.id_img) {
        const alert = await this.alertCtrl.create({
          header: "Sorry",
          subHeader: "Your Account not Verfied yet",
          message: "Please Upload Your Document to Verified.",
          buttons: [
            {
              text: "OK",
              handler: () => {
                this.navCtrl.navigateForward("/verification");
              }
            }
          ]
        });
        await alert.present();
      }
    } else if (!this.user.address || !this.user.state) {
      const alert = await this.alertCtrl.create({
        header: "Notice",
        subHeader: "Your Profiel is not Completed",
        message: "Please Complete your Profile.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.navCtrl.navigateForward("/edit-profile");
            }
          }
        ]
      });
      await alert.present();
    } else if (!this.user.tnc_agree) {
      const alert = await this.alertCtrl.create({
        header: "Term & Condition",
        subHeader: "Please Agree to Our Term & Conditions",
        message: "Please Read <a href='https://hq.meeracle.com.my/img/TNC.pdf'>Here</a>",
        buttons: [
          {
            text: "Diasagree",
            handler: () => {
               this.authService.logout().subscribe(
                data => {
                  // this.alertService.presentToast("Logged In");
                  console.log("Logged Out", data);
                },
                error => {
                  console.log("Logged Out Error ", error);
                }
              );
              this.menuCtrl.enable(false);
              this.navCtrl.navigateRoot("/");
            }
          },
           {
            text: "Agree",
             handler: () => {
               this.updateTnC();
              this.navCtrl.navigateForward("/home-results");
            }
          },
        ]
      });
      await alert.present();
    }
  }

  async register() {
    const registerModal = await this.modalCtrl.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  async login() {
    const loginModal = await this.modalCtrl.create({
      component: LoginPage
    });
    return await loginModal.present();
  }

  async geSlides() {
    // this.masterStockist = await this.store.get('masterStockist');
    console.log(this.masterStockist);
    // if(this.masterStockist === null){
    this.authService
      .getToken()
      .then(() => {
        const headers = new HttpHeaders({
          Authorization:
            this.authService.token["token_type"] +
            " " +
            this.authService.token["access_token"],
          Accept: "application/json"
        });
        this.http
          .get(this.env.API_URL + "slides", {
            headers: headers
          })
          .subscribe(
            data => {
              console.log(data);
              this.masterStockist = data["slides"];
              // this.store.set('masterStockist', this.masterStockist);
            },
            error => {
              console.log(error);
            }
          );
      })
      .catch(error => {
        console.log("No Token", error);
      });
    // }

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
    //         .get(this.env.API_URL + "slides", {
    //           headers: headers
    //         })
    //         .subscribe(
    //           data => {
    //             console.log(data)
    //             this.masterStockist = data["slides"];
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

  // async alertLocation() {
  //   const changeLocation = await this.alertCtrl.create({
  //     header: "Change Location",
  //     message: "Type your Address.",
  //     inputs: [
  //       {
  //         name: "location",
  //         placeholder: "Enter your new Location",
  //         type: "text"
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         handler: data => {
  //           console.log("Cancel clicked");
  //         }
  //       },
  //       {
  //         text: "Change",
  //         handler: async data => {
  //           console.log("Change clicked", data);
  //           this.yourLocation = data.location;
  //           const toast = await this.toastCtrl.create({
  //             message: "Location was change successfully",
  //             duration: 3000,
  //             position: "top",
  //             closeButtonText: "OK",
  //             showCloseButton: true
  //           });

  //           toast.present();
  //         }
  //       }
  //     ]
  //   });
  //   changeLocation.present();
  // }

  // async searchFilter() {
  //   const modal = await this.modalCtrl.create({
  //     component: SearchFilterPage
  //   });
  //   return await modal.present();
  // }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async updateTnC() {
        this.authService
      .getToken()
      .then(() => {
        const headers = new HttpHeaders({
          Authorization:
            this.authService.token["token_type"] +
            " " +
            this.authService.token["access_token"],
          Accept: "application/json"
        });
        this.http
          .post(this.env.API_URL + "update-tnc", {
            headers: headers
          })
          .subscribe(
            data => {
              console.log(data);
            },
            error => {
              console.log(error);
            }
          );
      })
      .catch(error => {
        console.log("No Token", error);
      });
  }

  // async notifications(ev: any) {
  //   const popover = await this.popoverCtrl.create({
  //     component: NotificationsComponent,
  //     event: ev,
  //     animated: true,
  //     showBackdrop: true
  //   });
  //   return await popover.present();
  //   this.navCtrl.navigateForward('cart');
  // }

  notifications() {
    this.navCtrl.navigateForward("cart");
  }
}
