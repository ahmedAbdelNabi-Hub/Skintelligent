import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { CommonModule, DatePipe } from '@angular/common';
import { MiniChatComponent } from './mini-chat.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IAppointmentSummary } from '../../../../core/models/interface/IAppointmentSummary';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPaginationParam } from '../../../../core/models/interface/IPaginationParam';
import { ChatService } from '../../../../core/services/chat.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MiniChatComponent, LoaderComponent, ReactiveFormsModule],
})
export class ReportsComponent implements OnInit, OnDestroy {


  isLoading = false;
  private destroy$ = new Subject<void>();
  aiChat: boolean = false;
  conversations: IAppointmentSummary[] = [];
  conversationId!: number;
  showMiniChat = false;
  chatPatientName = '';
  activeDropdown: number | null = null;
  chatMessages: { sender: string; text: string; time: string }[] = [];
  searchControl = new FormControl('');
  rowsControl = new FormControl(5);
  image = '';
  private PaginationParam: IPaginationParam = {
    PageIndex: 1,
    pageSize: 5,
    Search: ''
  };
  isLoadingReport = false;
  isLoadingSummary = false;
  totalItems = 0;

  constructor(private toastr: ToastService, private chatService: ChatService, private appointmentService: AppointmentService, private router: Router, private route: ActivatedRoute) { }
  deleteReport(id: number) {
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    this.chatService.deleteConversation(id).subscribe({
      next: () => {
        this.toastr.showSuccess('Conversation deleted successfully');
        this.fetchConversations();
      },
      error: (err) => {
        this.toastr.showError('Error deleting conversation');
      }
    });
  }


  regenerateReport(conversationId: number): void {
    this.isLoadingReport = true;
    this.chatService.regenerateReport(conversationId).subscribe({
      next: () => this.toastr.showSuccess('✅ Report regenerated successfully.'),
      error: () => this.toastr.showError('❌ Failed to regenerate report.'),
      complete: () => (this.isLoadingReport = false),
    });
  }

  regenerateSummary(conversationId: number): void {
    this.isLoadingSummary = true;
    this.chatService.reSummary(conversationId).subscribe({
      next: () => alert('✅ Summary regenerated successfully.'),
      error: () => alert('❌ Failed to regenerate summary.'),
      complete: () => (this.isLoadingSummary = false),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const paramValue = params['ai_chat'];
      this.aiChat = paramValue === 'true';
    });
    this.fetchConversations();
    this.initSearchSubscription();
    this.initRowsSubscription();
  }



  fetchConversations() {
    this.isLoading = true;
    this.appointmentService.getCompletedConversations(this.PaginationParam).pipe(
      tap((response: any) => {
        this.conversations = response.data || response;
        this.totalItems = response.totalCount || 0;
        console.log(this.conversations);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      error: (error) => {
        console.error('Error fetching conversations:', error);
        this.isLoading = false;
      }
    });
  }

  initSearchSubscription(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.PaginationParam.PageIndex = 1;
        this.PaginationParam.Search = this.searchControl.value || '';
        this.fetchConversations();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  initRowsSubscription(): void {
    this.rowsControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((value) => {
        const newSize = Number(value ?? 5);
        this.PaginationParam.pageSize = newSize > 0 ? newSize : 5;
        this.PaginationParam.PageIndex = 1;
        this.fetchConversations();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }


  parseJson(summaryJson: string): any {
    try {
      return JSON.parse(summaryJson);
    } catch {
      return {};
    }
  }

  openChatView(conversation: IAppointmentSummary) {
    this.conversationId = conversation.conversationId;
    this.chatPatientName = conversation.patientName;
    this.showMiniChat = true;
  }

  viewReport(conversation: IAppointmentSummary) {
    const summary = this.parseJson(conversation.summaryJson);
    this.image = conversation.imageBase64
      ? conversation.imageBase64
      : '';
    this.router.navigate(['/doctor-dashboard/report-view'], {
      queryParams: {
        summaryJson: encodeURIComponent(JSON.stringify(summary)),
        conversationId: conversation.conversationId,
        image: this.image
      }
    });
  }


  closeMiniChat() {
    this.showMiniChat = false;
  }

  toggleDropdown(appointmentId: number) {
    this.activeDropdown = this.activeDropdown === appointmentId ? null : appointmentId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.activeDropdown !== null && !(event.target as Element).closest('.relative')) {
      this.activeDropdown = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
