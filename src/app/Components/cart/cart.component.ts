import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FoodCorner } from 'src/app/Model/FoodCorner';
import { CartItemsService } from 'src/app/Service/cart-items.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FoodService } from 'src/app/Service/food.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  foods: FoodCorner[] = [];
  price: number = 0;
  @Input() totalCartItems: number = 0;
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource = new MatTableDataSource<FoodCorner>([]); // Initialize as an empty array
  currentPage: number = 1;
  itemsPerPage: number = 3;
  carts!: any
  public messageForm: FormGroup;
  constructor(
    private router: Router,
    private cartItemsService: CartItemsService,
    private foodService:FoodService,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      msg: ['', [Validators.required]],
    })

  }

ngOnInit(): void {
  this.cartItemsService.cartItems$.subscribe((cartItems) => {
    this.foods = cartItems;
    this.calculateTotalPrice();
  });

    this.carts = this.foodService.getCartItems();
    this.dataSource.data = this.foods;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      }
}
onInput(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}
removeFromCart(food: FoodCorner): void {
  this.cartItemsService.removeFromCart(food);
  const index = this.foods.indexOf(food);
  if (index > -1) {
    this.foods.splice(index, 1);
    this.calculateTotalPrice();
    this.cartItemsService.notifyItemRemoved();
    window.location.reload();
  }
}

loadCartItemsFromLocalStorage(): void {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    this.cartItemsService.updateCartItems(savedCartItems);
  }

increaseQuantity(food: FoodCorner): void {
    if (food.quantity < 100) {
      food.quantity++;
      this.calculateTotalPrice();
      this.cartItemsService.updateCartItemsInLocalStorage(this.foods); // Update local storage with the new cart items
    }
}


decreaseQuantity(food: FoodCorner): void {
    if (food.quantity > 1) {
      food.quantity--;
      this.calculateTotalPrice();
      this.cartItemsService.updateCartItemsInLocalStorage(this.foods); // Update local storage with the new cart items
    }
}

updateFoodInLocalStorage(food: FoodCorner): void {
    this.foodService.getCartItems().subscribe((cartItems: FoodCorner[]) => {
      const cartItem = cartItems.find((item: FoodCorner) => item.id === food.id);
      if (cartItem) {
        cartItem.quantity = food.quantity;
        this.cartItemsService.setCartItems(cartItems).subscribe(() => {
          this.cartItemsService.updateCartItemsInLocalStorage(cartItems);
        });
      }
    });
}

getFoodQuantity(foodId: string): number {
    const item = this.foods.find((food: FoodCorner) => food.id === foodId);
    return item ? item.quantity : 0;
}

calculateTotalPrice(): number {
  this.totalCartItems = this.foods.reduce((total, food) => total + (food.price * food.quantity), 0);
  return this.totalCartItems
}
calculateProductPrice(food: FoodCorner): number {
    return food.price * this.getFoodQuantity(food.id);
}

continue(): void {
  this.router.navigate(['/home']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
  checkout(): void {
    this.cartItemsService.sendCartItems(this.foods);
    this.router.navigate(['/checkout']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  save() {
    Swal.fire({
    position: "center",
    icon: "success",
    title: "Ihre Notiz wurde gespeichert",
    showConfirmButton: false,
    timer: 1500
    });
  }
}
