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

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  constructor(private authService: AuthService, public navCtrl: NavController, public menuCtrl: MenuController,) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      console.log('isLoggedin', this.authService.isLoggedIn);
      if (this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/home-results');
      }
    });
    this.menuCtrl.enable(true);
  }

}
