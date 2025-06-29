import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent {}
