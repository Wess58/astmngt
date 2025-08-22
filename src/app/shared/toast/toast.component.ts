import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../services/toast.model';

@Component({
  selector: 'app-toast',
  standalone:false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0, marginRight: -100 }),
        animate("200ms ease-in-out", style({ opacity: 1, marginRight: 0 })),
      ]),
      transition(':leave', [
        // :enter is alias to 'void => *'
        style({ opacity: 1, marginRight: 0, transform: 'scale(1)' }),
        animate("150ms", style({ opacity: 0, marginRight: -100, transform: 'scale(0.75)' })),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastSvc: ToastService) {}

  ngOnInit() {
    this.toastSvc.toasts.subscribe(t => this.toasts = t);
  }

  trackById(_: number, toast: Toast) {
    return toast.id;
  }

  dismiss(id: number) {
    this.toastSvc.dismiss(id);
  }
}
