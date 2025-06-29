import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pending-approval',
  imports: [RouterModule],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.scss'
})
export class PendingApprovalComponent implements OnInit {
 
  ngOnInit(): void {
    localStorage.setItem("re", "true");
  }
}
