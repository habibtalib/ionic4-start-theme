import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  ActionSheetController,
  Platform, LoadingController
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

const STORAGE_KEY = 'scanner';

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.page.html",
  styleUrls: ["./scanner.page.scss"]
})
export class ScannerPage implements OnInit {
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
  formData = new FormData();
  

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private env: EnvService, 
    public menuCtrl: MenuController,
    public barcodescanner: BarcodeScanner,
    private http: HttpClient,
    private toastController: ToastController,
    private storage: Storage, 
    private plt: Platform, 
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private filePath: FilePath,
    private camera: Camera, 
    private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }

  async submit() {
    if(!this.name || !this.address || !this.email || !this.phone) {
      const toast = await this.toastController.create({
        showCloseButton: true,
        // cssClass: 'bg-profile',
        message: 'Please Complete the form',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    } else if(this.serials.length === 0){
      const toast = await this.toastController.create({
        showCloseButton: true,
        // cssClass: 'bg-profile',
        message: 'Please Scan Item First',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }
     else {
      const loader = await this.loadingController.create({
        duration: 2000
      });
      this.formData.append('serials', JSON.stringify(this.serials));
      this.formData.append('name', this.name);
      this.formData.append('address', this.address);
      this.formData.append('phone', this.phone);
      this.formData.append('email', this.email);
      this.authService.getToken().then(() => {
        const headers = new HttpHeaders({
          Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
          Accept: "application/json"
        });
        loader.present();
        this.http
          .post(this.env.API_URL + "scanner", this.formData, { headers: headers })
          .subscribe(
            data => {
              console.log(data);
              // loader.present();
              this.storage.remove(STORAGE_KEY)
              loader.onWillDismiss().then(async l => {
                const toast = await this.toastController.create({
                  showCloseButton: true,
                  // cssClass: 'bg-profile',
                  message: 'Your Application has Been Submmited!',
                  duration: 3000,
                  position: 'bottom'
                });

                toast.present();
                this.navCtrl.navigateRoot("/orders");
              });
              this.images = []

            },
            error => {
              console.log(error);
              // loader.present();
              loader.onWillDismiss().then(async l => {
                const toast = await this.toastController.create({
                  showCloseButton: true,
                  // cssClass: 'bg-profile',
                  message: 'Your Application failed to Submmit!, reasone' + error.message,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
              });
            }
          );
      });
    }
  }
  

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
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
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

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.http.post("http://localhost:8888/upload.php", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('File upload complete.')
        } else {
          this.presentToast('File upload failed.')
        }
      });
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
        if(this.barcode.length === 6){
          this.serials.push({ 'serial_number': this.barcode, 'url': this.barcode });
        } else {
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
                this.serial = data;
                console.log("barcode", this.serial.serialNumber);
                // if (!this.serials.find(serial => serial === this.serial.serialNumber)) {
                //   this.serials.push(this.serial.serialNumber)
                // }
                this.serials.push({'serial_number' : this.serial.serialNumber, 'url' :this.barcode})
              },
              error => {});
          });
        }
      })
      .catch(err => {
        this.barcode = JSON.stringify(err);
      });
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
    this.getUser();
  }
}
