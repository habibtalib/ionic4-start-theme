import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';

import { EnvService } from './env.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;
  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private store: Storage,
    private env: EnvService,
  ) { }
  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/login',
      { email: email, password: password }
    ).pipe(
      tap(token => {
        // this.storage.setItem('token', token)
        //   .then(
        //     () => {
        //       console.log('Token Stored');
        //     },
        //     error => console.error('Error storing item', error)
        //   );
        this.store.set('token', token)
          .then(
            () => {
              console.log('Token Stored');
            },
            error => console.error('Error storing item', error)
          );
        this.token = token;
        console.log('token', token)
        this.isLoggedIn = true;
        return token;
      }),
    );
  }
  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/register',
      { fName: fName, lName: lName, email: email, password: password }
    )
  }
  logout() {
    this.isLoggedIn = false;
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get(this.env.API_URL + 'auth/logout', { headers: headers })
      .pipe(
        tap(data => {
          console.log('logoutdata',data);
          // this.storage.remove("token");
          this.store.remove("token");
          this.isLoggedIn = false;
          delete this.token;
          return data;
        },
        error =>{
          console.log(error)
        })
      )
  }
  
  user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
      .pipe(
        tap(user => {
          return user;
        })
      )
  }
  
  async getToken() {
    try {
      // const data = await this.storage.getItem('token');
      const data = await this.store.get('token');
      this.token = data;
      if (this.token != null) {
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
      return data
    }
    catch (error) {
      console.log('Get Token Error', error)
      this.token = null;
      this.isLoggedIn = false;
    }
  }
}