import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  ActionSheetController,
  Platform,
  LoadingController,
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-point-history",
  templateUrl: "./point-history.page.html",
  styleUrls: ["./point-history.page.scss"],
})
export class PointHistoryPage implements OnInit {
  constructor(
    private authService: AuthService,
    private env: EnvService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public menuCtrl: MenuController
  ) {}

  ngOnInit() {}
}
