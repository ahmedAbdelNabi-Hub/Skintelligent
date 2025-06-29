import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent {
  isLoggedIn: boolean = localStorage.getItem('token') ? true : false;
  @Input() role!: string;
}
