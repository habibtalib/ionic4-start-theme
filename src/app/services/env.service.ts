import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://api.meeracle.ml/api/';

  constructor() { }
}
