import { Component, OnInit } from '@angular/core';
import {
  NavController,
  MenuController,
  ToastController,
  LoadingController
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'points';

@Component({
  selector: "app-points",
  templateUrl: "./points.page.html",
  styleUrls: ["./points.page.scss"],
})
export class PointsPage implements OnInit {
  public barcode: string;
  public serial: any;
  public serials = [];
  images = [];
  member: any;
  user: any;
  name = "";
  address = "";
  phone = "";
  email = "";
  state = "";
  formData = new FormData();
  states: any;
  points: any;
  total = 0;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private env: EnvService,
    public menuCtrl: MenuController,
    public barcodescanner: BarcodeScanner,
    private http: HttpClient,
    private toastController: ToastController,
    private storage: Storage,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  scan() {
    let auth = {
      username: "edelsteenapi",
      password: "9bAHKVsp!pLdhVxF",
      companyCode: "MY4644",
    };

    this.barcodescanner
      .scan()
      .then((barcodeData) => {
        this.barcode = barcodeData["text"];
        if (!isNaN(Number(this.barcode))) {
          this.serials.push({ serial_number: this.barcode, url: this.barcode });
        } else {
          this.http
            .post("https://api.checknow.org/api/token", auth)
            .subscribe((data) => {
              console.log("token", data);
              const headers = new HttpHeaders({
                Authorization: "Bearer " + data,
                Accept: "application/json",
              });
              this.http
                .get(
                  "https://api.checknow.org/api/v1/SerialNumber?QrLink=" +
                    this.barcode,
                  {
                    headers: headers,
                  }
                )
                .subscribe(
                  (data) => {
                    this.serial = data;
                    console.log("barcode", this.serial.serialNumber);
                    // if (!this.serials.find(serial => serial === this.serial.serialNumber)) {
                    //   this.serials.push(this.serial.serialNumber)
                    // }
                    this.serials.push({
                      serial_number: this.serial.serialNumber,
                      product_name: this.serial.productName,
                      url: this.barcode,
                    });
                  },
                  (error) => {}
                );
            });
        }
      })
      .catch((err) => {
        this.barcode = JSON.stringify(err);
      });
  }

  pointHistory() {
      this.navCtrl.navigateRoot("/point-history");
  }

  getPoints() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json",
      });
      this.http
        .get(this.env.API_URL + "points", {
          headers: headers,
        })
        .subscribe(
          (data) => {
            console.log(data["points"]);
            this.points = data["points"];
            this.total = data["total"];
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

  async submit() {
    if (this.serials.length === 0) {
      const toast = await this.toastController.create({
        showCloseButton: true,
        // cssClass: 'bg-profile',
        message: "Please Scan Item First",
        duration: 3000,
        position: "bottom",
      });

      toast.present();
    } else {
      const loader = await this.loadingController.create({
        duration: 2000,
      });
      this.formData.append("serials", JSON.stringify(this.serials));
      this.authService.getToken().then(() => {
        const headers = new HttpHeaders({
          Authorization:
            this.authService.token["token_type"] +
            " " +
            this.authService.token["access_token"],
          Accept: "application/json",
        });
        loader.present();
        this.http
          .post(this.env.API_URL + "points", this.formData, {
            headers: headers,
          })
          .subscribe(
            (data) => {
              console.log(data);
              // loader.present();
              this.storage.remove(STORAGE_KEY);
              loader.onWillDismiss().then(async (l) => {
                const toast = await this.toastController.create({
                  showCloseButton: true,
                  // cssClass: 'bg-profile',
                  message: "Your Serials has Been Submmited!",
                  duration: 3000,
                  position: "bottom",
                });

                toast.present();
                this.serials = [];
                this.serial = null;
                this.barcode = null;
                this.getPoints();
              });
              this.images = [];
            },
            (error) => {
              console.log(error);
              // loader.present();
              loader.onWillDismiss().then(async (l) => {
                const toast = await this.toastController.create({
                  showCloseButton: true,
                  // cssClass: 'bg-profile',
                  message:
                    "Your Application failed to Submmit!, reason" +
                    error.message,
                  duration: 3000,
                  position: "bottom",
                });
                toast.present();
              });
            }
          );
      });
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.getPoints();
  }
}
