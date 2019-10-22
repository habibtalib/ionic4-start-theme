import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://api.meeracle.com.my/api/';

  constructor() { }
}
