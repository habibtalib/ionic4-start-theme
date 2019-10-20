import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController,
  ActionSheetController,
  Platform, LoadingController
} from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CartService } from "../../services/cart.service";
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { ThrowStmt } from '@angular/compiler';

const STORAGE_KEY = 'checkout';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  images = [];
  total : any;
  items : any;
  note = "";
  formData = new FormData();
  
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private http: HttpClient,
    private toastController: ToastController,
    private storage: Storage, 
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private camera: Camera, private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private cartService: CartService,
    private authService: AuthService,
    private env: EnvService,
  ) { }

  ngOnInit() {
    this.getStore();
  }

  async submit() {
    // await this.images.forEach(element => {
    //   this.startUpload(element)
    // });
    if(this.images.length > 0) {
      await this.startUpload(this.images[0])
    } else {
      this.uploadImageData();
    }
   
  }
  
  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // const formData = new FormData();
      this.formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      this.formData.append('payment_slip', imgBlob, file.name);
      this.uploadImageData();
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(){
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    this.formData.append("total", this.total.toFixed(2));
    this.formData.append('cart', JSON.stringify(this.items))
    this.formData.append('note', this.note)

    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json",
        ContentType:"application/json",
      });
      loader.present();
      this.http
        .post(this.env.API_URL + "order", this.formData, { headers: headers })
        .subscribe(
          data => {
            console.log(data)
            // loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Order has Been Submmited!',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
              this.storage.remove('total')
              this.storage.remove('cart')
              this.cartService.clearCart();
              this.navCtrl.navigateForward("/history");
            });
          },
          error => {
            console.log(error);
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                // cssClass: 'bg-profile',
                message: 'Your Order failed to Submmit!',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
              // this.storage.remove('total')
              // this.storage.remove('cart')
              // this.cartService.clearCart();
              // this.navCtrl.navigateForward('/home-results');
            });
          }
        );
    });
  }

  async getStore() {
    this.total = await this.storage.get('total')
    this.items = await this.storage.get('cart')
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('File removed.');
      });
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }
  
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      });
  }

  // async uploadImageData(formData: FormData) {
  //   const loading = await this.loadingController.create({
  //     message: 'Uploading image...',
  //   });
  //   await loading.present();

  //   this.http.post("http://localhost:8888/upload.php", formData)
  //     .pipe(
  //       finalize(() => {
  //         loading.dismiss();
  //       })
  //     )
  //     .subscribe(res => {
  //       if (res['success']) {
  //         this.presentToast('File upload complete.')
  //       } else {
  //         this.presentToast('File upload failed.')
  //       }
  //     });
  // }



  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

}
