import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FoodCorner } from 'src/app/Model/FoodCorner';
import { CartItemsService } from 'src/app/Service/cart-items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: FoodCorner[] = [];
  private cartItemsSubscription!: Subscription;
  totalPrice: number = 0;
  public purchaseForm: FormGroup;

  constructor(
    private cartItemsService: CartItemsService,
    private router: Router,
    private fb: FormBuilder) {

    this.purchaseForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^0[0-9]+$/)
      ]],
      cardNumber: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        Validators.pattern(/^[0-9]+$/)
      ]],
      expiration: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartItemsService.cartItems$.subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.totalPrice = this.calculateTotalPrice();  // إعادة حساب السعر الكلي عند تغيير العناصر
    });
    this.totalPrice = this.calculateTotalPrice();
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  track(): void {
    if (this.purchaseForm.valid) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Ihre Bestellung wurde erfolgreich versendet',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/user']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Bitte überprüfen Sie Ihre Eingaben',
        showConfirmButton: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription.unsubscribe();
  }
}
