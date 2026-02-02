import {MessageService} from 'primeng/api';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export const getErrorHandlers = (messageService: MessageService) => {
  const errorHandlers = [
    new NetworkErrorHandler(messageService),
    new ParameterErrorHandler(messageService),
    new ServerErrorHandler(messageService),
    new UnauthorizedErrorHandler(messageService),
    new ForbiddenErrorHandler(messageService),
    new NotFoundErrorHandler(messageService),
    new MethodNotAllowedErrorHandler(messageService),
    new UnsupportedMediaTypeErrorHandler(messageService),
    new UnprocessableEntityErrorHandler(messageService),
  ];
  return errorHandlers;
};

export const getResponseHandlers = (messageService: MessageService) => {
  const errorHandlers = [
    new ResponseValidatorHandler<ExpectedResponseType>(messageService, isValidResponse)
  ];
  return errorHandlers;
};

// 1. NetworkErrorHandler: Handles network errors (status 0)
// 2. ParameterErrorHandler: Handles parameter errors (status 400 or 422)
// 3. ServerErrorHandler: Handles server errors (status 500 or 503)
export class NetworkErrorHandler {
  constructor(private messageService: MessageService) {}

  handle(error: HttpErrorResponse): boolean {
    if (error.status === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Network Error',
        detail: 'Please check your internet connection 22.',
        life: 5000,
      });
      return true; // Indicates that this handler has processed the error
    }
    return false; // Pass to the next handler if not a network error
  }
}

// Example custom response validation handler
export class ResponseValidatorHandler<T> implements ErrorHandler {
  constructor(private messageService: MessageService,
              private validateResponse: (response: any) => response is T) {}

  canHandle(status: number): boolean {
    return status === 200;
  }

  handle(response: HttpResponse<any>): boolean {
    if (!this.validateResponse(response)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'The response format is invalid.',
        life: 3000
      });
      return true;
    }
    return false;
  }
}
interface ExpectedResponseType {
  [key:string]: any;
}
// Example usage
const isValidResponse = (response: any): response is ExpectedResponseType => {
  return response && typeof response.property === 'string';
};


export class ParameterErrorHandler {
  constructor(private messageService: MessageService) {}

  handle(error: HttpErrorResponse): boolean {
    if (error.status === 400 || error.status === 422) {
      const detail = this.extractErrorDetail(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Request',
        detail: detail || 'The request contains invalid parameters. Please check and try again.',
        life: 5000,
      });
      return true; // Indicates that this handler has processed the issue
    }
    return false; // Pass to the next handler if not a parameter error
  }

  private extractErrorDetail(error: HttpErrorResponse): string | null {
    // Example: Extract error message from server response
    if (error.error && typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    }
    return null;
  }
}

export class ServerErrorHandler {
  constructor(private messageService: MessageService) {}

  handle(error: HttpErrorResponse): boolean {
    if (error.status === 500 || error.status === 503) {
      const detail = this.getErrorDetail(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Server Error',
        detail: detail || 'The server encountered an error. Please try again later.',
        life: 5000,
      });
      return true; // Indicates that this handler has processed the issue
    }
    return false; // Pass to the next handler if not a server error
  }

  private getErrorDetail(error: HttpErrorResponse): string | null {
    // Example: Extract specific error details from the server response
    if (error.error && typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    }
    return null;
  }
}


export class UnauthorizedErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 401;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Unauthorized',
      detail: 'You are not authorized to access this resource.',
      life: 3000,
    });
  }
}

export class ForbiddenErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 403;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Forbidden',
      detail: 'You do not have permission to access this resource.',
      life: 3000,
    });
  }
}

export class NotFoundErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 404;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Not Found',
      detail: 'The requested resource could not be found.',
      life: 3000,
    });
  }
}

export class MethodNotAllowedErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 405;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Method Not Allowed',
      detail: 'The HTTP method used is not allowed for this resource.',
      life: 3000,
    });
  }
}

export class UnsupportedMediaTypeErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 415;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Unsupported Media Type',
      detail: 'The media type of the request is not supported.',
      life: 3000,
    });
  }
}

export class UnprocessableEntityErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}

  canHandle(status: number): boolean {
    return status === 422;
  }

  handle(error: any): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Unprocessable Entity',
      detail: 'The server could not process the request due to semantic errors.',
      life: 3000,
    });
  }
}

export interface ErrorHandler {
  /**
   * Determina si el manejador puede gestionar un error dado el estado HTTP.
   * @param status El código de estado HTTP del error.
   * @returns `true` si el manejador puede gestionar el error, de lo contrario `false`.
   */
  canHandle(status: number): boolean;

  /**
   * Lógica para manejar el error.
   * @param error El error completo recibido.
   */
  handle(error: any): void;
}
