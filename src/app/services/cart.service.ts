import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private data = [
  ];

  private cart = [];

  constructor() {}

  getProducts() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  addProduct(product) {
    let card = null
    if(card = this.cart.filter(item=>{
      return item.id === product.id
    })) {
      console.log(card);
      this.cart[card].count += 1
      console.log(this.cart[card].count);
    } else {
      this.cart.push(product);
    }
    
  }
}
