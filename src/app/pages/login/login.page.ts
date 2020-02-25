import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalController,
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { AlertService } from "src/app/services/alert.service";
import { RegisterPage } from "../register/register.page";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  passwordType: string = "password";
  passwordIcon: string = "eye-off";
  formData = new FormData();

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authService: AuthService,
    private alertService: AlertService,
    private env: EnvService,
    private http: HttpClient,
    private iab: InAppBrowser
  ) {}

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  openBrowser() {
    this.iab.create("https://app.meeracle.com.my/password/reset");
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if (this.authService.isLoggedIn) {
        // this.navCtrl.navigateRoot("/home-results");
      }
    });
    this.menuCtrl.enable(false);
  }

  // Dismiss Login Modal
  dismissLogin() {
    this.modalController.dismiss();
  }

  // On Register button tap, dismiss login modal and open register modal
  async registerModal() {
    // this.dismissLogin();
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  login(form: NgForm) {
    this.authService.login(form.value.email, form.value.password).subscribe(
      data => {
        // this.alertService.presentToast("Logged In");
      },
      error => {
        console.log(error);
        if (error.status === 401) {
          this.alertService.presentToast("Wrong Email or Password");
        }
        if (error.status === 422) {
          this.alertService.presentToast("Invalid Format");
        } else {
          this.alertService.presentToast("Error: " + error.message);
        }
      },
      () => {
        // this.dismissLogin();
        this.navCtrl.navigateRoot("/home-results");
      }
    );
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: "Forgot Password?",
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Confirm",
          handler: async value => {
            console.log(value);
            this.formData.append("email", value.email);
            this.http
              .post(this.env.API_URL + "auth/forget-password", this.formData)
              .subscribe(
                data => {
                  console.log(data);
                },
                error => {
                  console.log(error);
                }
              );

            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: "Email was sended successfully.",
                duration: 3000,
                position: "bottom"
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async postForgotPassword() {}

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot("/register");
  }

  goToHome() {
    this.navCtrl.navigateRoot("/home-results");
  }
}
