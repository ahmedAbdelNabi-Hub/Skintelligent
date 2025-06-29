import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-cart',
  imports: [CommonModule],
  templateUrl: './dashboard-cart.component.html',
  styleUrl: './dashboard-cart.component.scss'
})
export class DashboardCartComponent {
  @Input("label") label!: string ;  
  @Input("amount") amount: number = 0;                 
  @Input("currency") currency: string = 'ج.م';             
  @Input("percentageChange") percentageChange: number = 0;       
  @Input("isPositiveChange") isPositiveChange: boolean = true; 
  @Input("icon") icon: string = ''; 
  @Input("isLoading") isLoading :boolean=true; 
  
}
