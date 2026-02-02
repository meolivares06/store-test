import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {getErrorHandlers, getResponseHandlers} from '@app/core/interceptors/errors';
import {inject} from '@angular/core';
import {MessageService} from 'primeng/api';

export function globalErrorsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  const errorHandlers = getErrorHandlers(messageService);
  const responseHandlers = getResponseHandlers(messageService);
  return next(req).pipe(
    tap((event:  HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        for (const handler of responseHandlers) {
          if (handler.handle(event)) {
            return; // Stop further processing if the response is invalid
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(error);
      for (const handler of errorHandlers) {
        if (handler.handle(error)) {
          // Stop if the error is handled
          return throwError(() => new Error(error.message));
        }
      }
      return throwError(() => new Error(error.message));
    })
  );
}
