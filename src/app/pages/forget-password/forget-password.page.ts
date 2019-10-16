import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
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
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])]
    });
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


}
