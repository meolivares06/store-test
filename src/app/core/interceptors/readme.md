# Angular Global Error Handling and Interceptor Framework

This document provides a comprehensive guide to the error handling and HTTP interceptor implementation for an Angular application. The system is designed to handle various error scenarios in a modular and extensible way, adhering to the Single Responsibility Principle (SRP).

---

## Overview

### Key Features:
- **Network Error Handling**: Detect and manage scenarios where the user loses internet connection.
- **Response Validation**: Ensure that server responses match the expected format, even for successful responses (HTTP 200).
- **Parameter Errors**: Handle scenarios where incorrect parameters are sent to the API.
- **Internal Server Errors**: Manage server-side issues and provide appropriate feedback.
- **Modular Design**: Each error handling scenario is encapsulated in its own class, making the system extensible and maintainable.

---

## Implementation Details

### Error Handlers

Each error type is handled by a specific class implementing the `ErrorHandler` interface:

```typescript
export interface ErrorHandler {
  canHandle(error: HttpErrorResponse): boolean;
  handle(error: HttpErrorResponse, messageService: MessageService): void;
}
```

#### 1. **NetworkErrorHandler**
Handles network-related errors (e.g., no internet connection).

#### 2. **ResponseValidatorHandler**
Validates that the server's response matches the expected format. A generic type can now be passed to `defaultValidation` for stricter type checks.

#### 3. **ParameterErrorHandler**
Handles errors caused by incorrect parameters sent to the API.

#### 4. **InternalServerErrorHandler**
Handles server-side errors (e.g., HTTP 500, 503).

#### 5. **UnexpectedErrorHandler**
Handles any other unexpected errors that do not fit into the above categories.

### ResponseValidatorHandler Update

A new generic type feature has been added to `defaultValidation` for stricter type checking:

```typescript
export class ResponseValidatorHandler<T> implements ErrorHandler {
  constructor(private validateResponse: (response: any) => response is T) {}

  canHandle(error: HttpErrorResponse): boolean {
    return error.status === 200;
  }

  handle(error: HttpErrorResponse, messageService: MessageService): void {
    if (!this.validateResponse(error.error)) {
      messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'The response format is invalid.',
        life: 3000
      });
    }
  }
}

// Example usage
const isValidResponse = (response: any): response is ExpectedResponseType => {
  return response && typeof response.property === 'string';
};

const responseValidator = new ResponseValidatorHandler<ExpectedResponseType>(isValidResponse);
```

---

### Global Error Interceptor

The `GlobalErrorInterceptor` uses the `ErrorHandler` implementations to handle errors in a centralized manner:

```typescript
@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService, private handlers: ErrorHandler[]) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const handler = this.handlers.find(h => h.canHandle(error));
        if (handler) {
          handler.handle(error, this.messageService);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Unexpected Error',
            detail: 'An unexpected error occurred.',
            life: 3000
          });
        }
        return throwError(() => new Error(error.message));
      })
    );
  }
}
```

---

## Usage

1. **Register Error Handlers**

In your Angular module, provide the error handlers:

```typescript
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalErrorInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: NetworkErrorHandler, multi: true },
    { provide: ErrorHandler, useClass: ResponseValidatorHandler, multi: true },
    { provide: ErrorHandler, useClass: ParameterErrorHandler, multi: true },
    { provide: ErrorHandler, useClass: InternalServerErrorHandler, multi: true },
    { provide: ErrorHandler, useClass: UnexpectedErrorHandler, multi: true }
  ]
})
export class AppModule {}
```

2. **Define Response Validation**

Create a function to validate the expected response format:

```typescript
const isValidResponse = (response: any): response is ExpectedResponseType => {
  return response && typeof response.property === 'string';
};
```

3. **Extend or Modify Handlers**

To add or remove error handling logic, create new classes implementing `ErrorHandler` and register them in the module.

---

## Conclusion

This modular and extensible error handling framework ensures that your Angular application is robust and user-friendly. By centralizing error handling and leveraging TypeScript's type-checking capabilities, the system is both powerful and maintainable.

