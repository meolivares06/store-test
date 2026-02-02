import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {MessageService} from 'primeng/api';
import {inject} from '@angular/core';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  // return next(req);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      /* estudiar si este codigo puede extraerse para una funcion sin necesitar el injector.
      * En caso que si como pasarlo con aquella variante del token en linkedin*/
      if (error instanceof HttpErrorResponse) {
        const {status} = error;
        netWorkServerError(status, messageService);
      }

      // Updated throwError to pass a function
      return throwError(() => new Error(error.message));
    })
  );
}

function netWorkServerError(status: number, messageService: MessageService) {
  switch (status) {
    case 0:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Network error', life: 3000})
      break;
    case 400:
      messageService.add({
        severity: 'warning',
        summary: 'Info',
        detail: 'Something wrong with the request, please correct it and send it again.',
        life: 3000
      })
      break;
    case 401:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Unauthorized', life: 3000})
      break;
    case 403:
      // this.router.navigate(['/static/access']).then();
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Forbidden', life: 3000})
      break;
    case 404:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Resource not found', life: 3000})
      break;
    case 405:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Method not allowed', life: 3000})
      break;
    case 415:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Unsupported media type', life: 3000})
      break;
    case 422:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Unprocessable entity', life: 3000})
      break;
    case 500:
      // this.router.navigate(['/static/error']).then();
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Server error', life: 3000})
      break;
    case 503:
      // this.router.navigate(['/static/error']).then();
      messageService.add({severity: 'warning', summary: 'Info', detail: 'Service unavailable', life: 3000})
      break;
    default:
      messageService.add({severity: 'warning', summary: 'Info', detail: 'An unexpected error occurred', life: 3000})
      break;
  }
}



/*
* Errores de red : el escenario "sin conexión a Internet".
formatos de respuesta no válidos : incluso si el servidor responde con un código de estado 200, es posible que los datos no estén en el formato que esperamos.
errores inesperados : el servidor podría devolver varios códigos de error, como 4xx o 5xx, pero distintos del 400 Bad Request
* */
