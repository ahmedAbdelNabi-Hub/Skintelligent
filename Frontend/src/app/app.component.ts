import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routingAnimation } from './core/animations/routingAnimation';
import { NgToastModule } from 'ng-angular-popup';
import { initFlowbite } from 'flowbite';
import { ToastComponent } from "./shared/components/toast/toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgToastModule, ToastComponent],
  animations: [routingAnimation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
  title = 'Skintelligent';
  ToasterPosition: any = {
    TOP_LEFT: 'toaster-top-left',
    TOP_CENTER: 'toaster-top-center',
    TOP_RIGHT: 'toaster-top-right',
    BOTTOM_LEFT: 'toaster-bottom-left',
    BOTTOM_CENTER: 'toaster-bottom-center',
    BOTTOM_RIGHT: 'toaster-bottom-right',
  };
}
