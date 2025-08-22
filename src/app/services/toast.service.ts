import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from './toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private counter = 0;

  get toasts() {
    return this.toasts$.asObservable();
  }

  show(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const toast: Toast = {
      id: ++this.counter,
      message,
      type,
      duration
    };

    this.toasts$.next([]);
    setTimeout(() => {
      this.toasts$.next([toast]);
    }, 100);
    // this.toasts$.next([...this.toasts$.value, toast]);


    // auto‐dismiss
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number) {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }

  // convenience methods
  success(msg: string, d?: number) { this.show(msg, 'success', d); }
  error(msg: string, d?: number) { this.show(msg, 'error', d); }
  info(msg: string, d?: number) { this.show(msg, 'info', d); }
  warning(msg: string, d?: number) { this.show(msg, 'warning', d); }
}
