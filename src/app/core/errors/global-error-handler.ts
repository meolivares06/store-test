import {ErrorHandler, inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';
import {HttpResponseBodyFormatError} from '@app/core/interceptors/server-error.interceptor';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  messageService = inject(MessageService);

  handleError(error: any): void {
    if(!(error instanceof HttpResponseBodyFormatError)) {
      console.warn('Global error caught:', error);
      this.messageService.add({severity: 'warning', summary: 'Info', detail: 'An unexpected error occurred. Please try again later.22', life: 3000})
    }
  }
}
