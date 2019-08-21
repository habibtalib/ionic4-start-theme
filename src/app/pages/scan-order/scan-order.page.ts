import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  ActionSheetController,
  Platform, LoadingController
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from "../../services/env.service";

@Component({
  selector: 'app-scan-order',
  templateUrl: './scan-order.page.html',
  styleUrls: ['./scan-order.page.scss'],
})
export class ScanOrderPage implements OnInit {
  public barcode: string;
  public serial: any;
  public serials:any;
  images = [];
  formData = new FormData();
  myId: any;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public barcodescanner: BarcodeScanner,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private env: EnvService,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  async submit() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    this.formData = new FormData();
    this.formData.append('serials', JSON.stringify(this.serials))
    loader.present();
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .post(this.env.API_URL + "order-scanner/" + this.myId, this.formData, { headers: headers })
        .subscribe(
          data => {
            console.log(data)
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Update has Been Submmited!',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.navCtrl.navigateForward('/home-results');
            });
            
          },
          error => {
            console.log(error);
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Update failed to Submmit!',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            });
          }
        );
    });
  }

  scan() {
    let auth = {
      username: "edelsteenapi",
      password: "9bAHKVsp!pLdhVxF",
      companyCode: "MY4644"
    };

    this.barcodescanner
      .scan()
      .then(barcodeData => {
        this.barcode = barcodeData["text"];
        this.http
          .post("https://api.checknow.org/api/token", auth)
          .subscribe(data => {
            console.log("token", data);
            const headers = new HttpHeaders({
              Authorization: "Bearer " + data,
              Accept: "application/json"
            });
            this.http
              .get(
                "https://api.checknow.org/api/v1/SerialNumber?QrLink=" +
                this.barcode,
                {
                  headers: headers
                }
              )
              .subscribe(data => {
                this.serial = JSON.stringify(data);
                console.log("barcode", this.serial);
                if (!this.serials.find(serial => serial === this.serial)) {
                  this.serials.push(this.serial)
                }
              });
          });
      })
      .catch(err => {
        this.barcode = JSON.stringify(err);
      });
  }

}
