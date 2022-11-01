import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart:Cart =  this.getCartFromLocalStorage(); //new Cart();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() { }

  addToCart(food:Food):void{
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if(cartItem)
    return;

    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  removeFromCart(foodId:string):void{
    this.cart.items = this.cart.items.filter(item => item.food.id != foodId);
    this.setCartToLocalStorage();
  }

  changeQuatitive(foodId:string, quantity:number){
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if(!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();

  }

  clearCart(){
    this.cart = new Cart();
    this.setCartToLocalStorage();

  }

  getCartObservable():Observable<Cart>{
    return this.cartSubject.asObservable();
  }

  private setCartToLocalStorage():void{
    // Totalprice
    this.cart.totalPrice = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.food.price, 0);
    // TotalCount
    this.cart.totalCount = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);
    // Storing Cart Item in localstorage
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('cart', cartJson);
    this.cartSubject.next(this.cart);// when we set something on localstorage it means
    //we are changing the cart so anybody who's listening to the cart observable
    //should be notified notify all the listeners of the cart observable we need use this.
  }
  // Getting CartItem form localstorage
  private getCartFromLocalStorage():Cart{
    const cartJson = localStorage.getItem('Cart');
    return cartJson? JSON.parse(cartJson): new Cart();
  }
}
