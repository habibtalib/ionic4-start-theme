import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.page.html",
  styleUrls: ["./scanner.page.scss"]
})
export class ScannerPage implements OnInit {
  public barcode: string;
  public serial: any;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public barcodescanner: BarcodeScanner,
    private http: HttpClient
  ) {}

  ngOnInit() {}

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
                console.log("barcode", data);
                this.serial = JSON.stringify(data);
              });
          });
      })
      .catch(err => {
        this.barcode = JSON.stringify(err);
      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
}
