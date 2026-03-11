# Key Points for Senior Angular Interview

This document analyzes an Angular 19 project prepared for senior-level interviews.

---

## 1. Angular 19 + Signals

- Using `signal()` for reactive state (`sell-store.service.ts:13`)
- `signal()` with `.update()` and `.set()` for mutation
- Modern `inject()` instead of constructor injection

**Technical details:**

```typescript
// sell-store.service.ts
export class SellStoreService implements StoreService<Sell> {
  firebaseService = inject(SellFirebaseService);
  list = signal<Sell[]>([]);  // Signal typed
  loading = false;

  add(item: Sell): void {
    this.lis.update(l => [...l, item]);  // Immutability
  }
}
```

- **Why it matters:** Angular 19 makes signals the default. A senior must know when to use signals vs observables (signals for synchronous UI state, observables for async streams).
- **Pattern:** This is a lightweight "Signal Store" - doesn't use NgRx/Angular Signals, but captures the essence: reactive state with automatic UI updates.

---

## 2. Generic Store Pattern

- `StoreService<T>` interface (`basecrud.model.ts:5-27`) with generic type
- Implementation for each feature (Sell, Client, Product)
- Separates state logic from Firebase

```typescript
// basecrud.model.ts
export interface StoreService<T> {
  firebaseService: FirebaseService<T>;
  list: WritableSignal<T[]>;
  loading: boolean;
  addList(items: T[]): void;
  add(item: T): void;
  remove(id: string): void;
  update(client: T): void;
  addFirebase(rawValue: any): Observable<string>;
  updateFirebase(rawValue: any): Observable<void>;
  deleteFirebase(rowData: any): Observable<void>;
  getFirebase(): Observable<T[]>;
  refresh(): Observable<T[]>;
}
```

- **Detail:** Each feature implements this interface (`ClientStoreService`, `SellStoreService`, `ProductStoreService`)
- **Advantage:** If tomorrow Firebase changes to REST API, only `FirebaseService` needs modification, the store stays intact.

---

## 3. ChangeDetectionStrategy.OnPush

- All components use it (base-crud, datatable, base-form)
- Critical performance optimization

**Technical details:**

```typescript
@Component({
  selector: 'app-base-crud',
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Important
})
export class BaseCrudComponent<T> implements OnDestroy { ... }
```

- **Why it works:** With OnPush, Angular only checks the component when:
  1. Input reference changes
  2. Event within the component
  3. Signal observable-linked
  4. Async pipe in template
- **Deadly combo:** OnPush + Signals = near zero-cost change detection

---

## 4. Functional Interceptors (Angular 17+)

- `globalErrorsInterceptor` uses the new `HttpInterceptorFn` pattern (`global-errors.interceptor.ts:7`)
- Functional interceptors vs old class-based approach

```typescript
// New way (Angular 17+)
export function globalErrorsInterceptor(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  const errorHandlers = getErrorHandlers(messageService);
  
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        // Response handlers
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Error handlers
    })
  );
}
```

**Registration in app.config.ts:**
```typescript
provideHttpClient(
  withFetch(), 
  withInterceptors([globalErrorsInterceptor])
)
```

- **Why it's better:** More testable, tree-shakeable, composable (easy to chain multiple interceptors).

---

## 5. AngularFire + Firebase

- Complete Firestore integration
- `provideFirebaseApp()` + `provideFirestore()` in app config

**Configuration:**

```typescript
// app.config.ts
const firebaseConfig = { /* config */ };

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // ...
  ]
};
```

**Generic Firebase Service:**
```typescript
// sell-firebase.service.ts
export class SellFirebaseService implements FirebaseService<Sell> {
  firestore = inject(Firestore);
  basePath = 'sell';
  collectionRef = collection(this.firestore, this.basePath);

  get(): Observable<Sell[]> {
    const q = query(this.collectionRef, orderBy('creationDate', 'asc'));
    return collectionData(q, {idField: 'id'}).pipe(
      map(document => sellAdapter(document)),
      catchError(() => of([]))
    );
  }
}
```

- **Adapter pattern:** `sellAdapter` transforms Firestore data (with Timestamp) to plain JS objects.

---

## 6. Custom Structural Directive

- Directive with `effect()` and signals (`custom-structural.directive.ts:11-18`)
- TemplateRef + ViewContainerRef for dynamic rendering

```typescript
@Directive({
  selector: '[appCustomStructural]',
  standalone: true
})
export class CustomStructuralDirective {
  tmplRef = inject(TemplateRef);
  viewContainerRef = inject(ViewContainerRef);

  showIfAdmin = input(false);  // Signal input
  
  myEffect = effect(() => {
    if(this.showIfAdmin()) {
      this.viewContainerRef.createEmbeddedView(this.tmplRef);
    } else {
      this.viewContainerRef.clear();
    }
  });
}
```

**Usage in template:**
```html
<ng-template appCustomStructural [showIfAdmin]="isAdmin">
  <p>Content only for admins</p>
</ng-template>
```

- **Why it's powerful:** Custom structural directives allow complex rendering logic that ngIf can't handle.

---

## 7. Functional Resolvers

- `ResolveFn<Sell[]>` instead of class (`sell.resolver.ts:7`)
- Uses `inject()` and `firstValueFrom`

```typescript
// sell.resolver.ts
export const sellResolver: ResolveFn<Sell[]> = (route, state) => {
  const store = inject(SellStoreService);

  if (store.list().length > 0) {
    return store.list();  // Store cache
  } else {
    return firstValueFrom(of([]).pipe(
      switchMap(() => store.getFirebase())
    ));
  }
};
```

- **Key pattern:** Checks if store already has data (avoids extra Firebase call) - optimizations a senior considers.

---

## 8. Dynamic Components

- `ViewContainerRef.createComponent()` for dynamic card rendering (`datatable.component.ts:124`)
- `DatatableComponent` detects mobile and dynamically renders `CardMobileComponent`
- Uses `ComponentRef` + `setInput()` to pass data to child component

**Complete technical details:**

```typescript
private loadContent() {
  this.value.forEach(item => {
    // Create component reference dynamically
    const cmpRef: ComponentRef<CardMobileComponent<typeof item>> = 
      this.viewContainer.createComponent(this.cardItem);
    
    // Pass input to child component (new Angular 16+ method)
    cmpRef.setInput('oneItem', item);
    
    // Force change detection on child component
    cmpRef.changeDetectorRef.detectChanges();
  });
}
```

- **Why it's interesting:** This pattern allows rendering different components based on context (responsive design at component level, not just CSS), useful for mobile-first where the table transforms into dynamically rendered cards.

---

## 9. Path Aliases

- `@app`, `@feat`, `@shared` configured in tsconfig
- Clean imports

**Configuration in tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/app/*"],
      "@feat/*": ["src/app/features/*"],
      "@shared/*": ["src/app/shared/*"],
      "@layout/*": ["src/app/layout/*"],
      "@client/*": ["src/app/features/client/*"],
      "@product/*": ["src/app/features/product/*"],
      "@sell/*": ["src/app/features/sell/*"]
    }
  }
}
```

**Usage:**
```typescript
import {Sell} from '@feat/sell/sell.model';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
```

- **Benefit:** Short import paths, easy refactors, clear where each module comes from.

---

## 10. Global Error Handling

- Custom `ErrorHandler` (`GlobalErrorHandler`)
- Custom validator for CPF (`cpf.validator.ts`)

**Global Error Handler:**

```typescript
// global-error-handler.ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}
  
  handleError(error: Error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message
    });
    console.error(error);
  }
}
```

**Registration:**
```typescript
// app.config.ts
{provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [MessageService]}
```

**CPF Validator:**
```typescript
import { validateBr, utilsBr } from 'js-brasil';

export const cpf: ValidatorFn = (control: AbstractControl): Record<string, boolean> | null => {
  if (utilsBr.isPresent(Validators.required(control))) {
    return null;
  }
  return validateBr['cpf'](control.value) ? null : {cpf: true};
};
```

- **Why it matters:** A senior knows error handling is not optional - it must be centralized and user-friendly.

---

## 11. SSR/SSG

- Angular SSR configured (`@angular/ssr`)
- `provideClientHydration()` available

**Configuration:**

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideClientHydration() ← available if needed
  ]
};
```

- **Installed packages:** `@angular/ssr`, `@angular/platform-server`
- **Scripts:**
```json
{
  "serve:ssr:storetest": "node dist/storetest/server/server.mjs"
}
```

- **Why it's important:** SSR improves SEO and FCP (First Contentful Paint), critical for e-commerce.

---

## 12. Lazy Loading

- `loadChildren: () => import(...)` in routes (`app.routes.ts:6`)

**Details:**

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@app/layout/layout.routes')
      .then(l => l.layoutRoutes)
  },
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];
```

```typescript
// layout.routes.ts
export const layoutRoutes: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { 
    path: 'client', 
    loadComponent: () => import('@feat/client/client/client.component')
      .then(m => m.ClientComponent) 
  },
  // ...
];
```

**Advantages:**
- Automatic code splitting
- Only loads what the user needs
- Reduced bundle size

---

## 13. Reusable Base Components

- **Generic `BaseCrudComponent<T>` and `BaseFormComponent<T>`**
- Template method pattern with abstract methods that child classes implement

### BaseCrudComponent (base-crud.component.ts)

```typescript
export class BaseCrudComponent<T> implements OnDestroy {
  store: StoreService<T>;
  subscriptions: Subscription[] = [];
  cols: Column[] = [];
  cardItem: Type<any>;

  // Abstract methods each feature implements
  onDelete(rowData: T) { throw new Error('not implemented'); }
  onCreate() { throw new Error('not implemented'); }
  onRefresh() { throw new Error('not implemented'); }
  onEdit(rowData: T) { throw new Error('not implemented'); }
}
```

### BaseFormComponent (base-form.component.ts)

```typescript
export class BaseFormComponent<T> {
  form: FormGroup;
  ref = inject(DynamicDialogRef);
  dialogService = inject(DynamicDialogConfig);
  storeService: StoreService<T>;

  // Template method: each child defines their form
  initForm(data?: any): void {
    throw new Error('Init form must be implemented');
  }

  // Reusable save/update logic
  onSave(): void { ... }
}
```

**Example implementation in child:**

```typescript
// In SellComponent extending BaseCrudComponent<Sell>
onEdit(rowData: Sell): void {
  this.ref = this.dialogService.open(SellFormComponent, {
    header: 'Edit Sale',
    data: rowData
  });
}
```

- **Why it matters for seniors:** Demonstrates knowledge of:
  - **TypeScript Generics** (`<T>`)
  - **Template Method Pattern** (define skeleton, let implementation to children)
  - **DRY (Don't Repeat Yourself)** - reusable CRUD logic
  - **Inversion of Control** - parent orchestrates, child customizes
  - **Interfaces vs Implementation** - decoupling

---

## SOLID Application in Modules

The project applies SOLID principles in a practical, not theoretical way:

### Folder Structure

```
src/app/
├── core/                    # 🔴 Core (SRP: single responsibility)
│   ├── adapters/           # Data transformation
│   ├── directives/          # Reusable directives
│   ├── errors/             # Global error handling
│   ├── interceptors/       # HTTP interceptors
│   ├── pipes/              # Reusable pipes (CPF, CEP)
│   └── validators/         # Custom validators
│
├── features/               # 🔵 Features (each folder = one domain)
│   ├── client/
│   │   ├── services/       # ClientStoreService
│   │   ├── resolver/
│   │   ├── component/      # List, Form
│   │   └── client.model.ts
│   ├── sell/
│   └── product/
│
├── shared/                 # 🟢 Shared (reusable code)
│   └── components/
│       ├── base-crud/      # Generic CRUD base
│       ├── base-form/      # Generic form base
│       └── datatable/     # Generic table component
│
└── layout/                 # 🟡 Layout (app shell)
```

---

### S - Single Responsibility Principle

**Definition:** A class should have only one reason to change.

**Application in the project:**

| Class | Responsibility | Why it fulfills SRP |
|-------|----------------|---------------------|
| `SellStoreService` | Manage sales state | Only does one thing: state + Firebase sync |
| `SellFirebaseService` | Communicate with Firestore | Doesn't know about state, only does CRUD |
| `cpf.validator.ts` | Validate CPF | Single validation |
| `sellAdapter` | Transform data | Only transforms, doesn't persist |
| `GlobalErrorHandler` | Display errors | Only handles global errors |

**Example - Not violating SRP:**
```typescript
// Correct: Separation of responsibilities
// firebase-only.ts
export class SellFirebaseService {
  get(): Observable<Sell[]> { ... }
}

// store-only.ts
export class SellStoreService {
  list = signal<Sell[]>([]);  // Only state
  addFirebase(rawValue) { 
    return this.firebaseService.add(rawValue).pipe(
      tap(result => this.add({id: result, ...rawValue}))
    );
  }
}
```

---

### O - Open/Closed Principle

**Definition:** Software entities should be open for extension but closed for modification.

**Application:**

- **`DatatableComponent` open for extension:**
```typescript
// datatable.component.ts
@Input() cardItem: Type<any>;  // ← Extend with any component
@Input() cols = cols;

// Component detects mobile and renders cardItem dynamically
private loadContent() {
  const cmpRef = this.viewContainer.createComponent(this.cardItem);
  cmpRef.setInput('oneItem', item);
}
```

- **Extensible base components:**
```typescript
// Child classes EXTEND behavior without modifying base
export class SellComponent extends BaseCrudComponent<Sell> {
  onEdit(rowData: Sell) { /* custom */ }
  onCreate() { /* custom */ }
}
```

- **Adding new pipes without modifying existing ones:**
```typescript
// Only add, don't touch existing pipe
import {CepPipe, CpfCnpjPipe} from '@app/core/pipes/';
```

---

### L - Liskov Substitution Principle

**Definition:** Objects of a base class should be replaceable with objects of subclasses without altering program correctness.

**Application:**

- **StoreService implementable by any feature:**
```typescript
// basecrud.model.ts - Base interface
export interface StoreService<T> {
  list: WritableSignal<T[]>;
  add(item: T): void;
  // ...
}

// Any class implementing this interface works the same
export class ClientStoreService implements StoreService<Client> { ... }
export class SellStoreService implements StoreService<Sell> { ... }
export class ProductStoreService implements StoreService<Product> { ... }
```

- **Injectable FirebaseService:**
```typescript
export interface FirebaseService<T> {
  firestore: Firestore;
  get(): Observable<T[]>;
  add(data: T): Observable<string>;
  // ...
}

// All implementations are interchangeable
export class SellFirebaseService implements FirebaseService<Sell> { ... }
export class ClientFirebaseService implements FirebaseService<Client> { ... }
```

---

### I - Interface Segregation Principle

**Definition:** It's better to have many specific interfaces than one general interface.

**Application:**

- **Separate interfaces for each responsibility:**
```typescript
// StoreService - only state management
export interface StoreService<T> {
  list: WritableSignal<T[]>;
  add(item: T): void;
  remove(id: string): void;
  // Doesn't know about Firestore
}

// FirebaseService - only persistence
export interface FirebaseService<T> {
  firestore: Firestore;
  basePath: string;
  get(): Observable<T[]>;
  add(data: T): Observable<string>;
  // Doesn't know about local state
}
```

- **Both interfaces used in the store:**
```typescript
export class SellStoreService implements StoreService<Sell> {
  firebaseService = inject(SellFirebaseService);  // Injects the other interface
  // ...
}
```

---

### D - Dependency Inversion Principle

**Definition:** Depend on abstractions, not on concretions.

**Application:**

- **Store depends on interface, not concrete implementation:**
```typescript
export class SellStoreService implements StoreService<Sell> {
  // ✅ Depends on FirebaseService interface
  firebaseService = inject(SellFirebaseService);
  
  // ✅ Doesn't matter what implementation, as long as it fulfills the interface
  addFirebase(rawValue: any): Observable<string> {
    return this.firebaseService.add(rawValue);  // Polymorphism
  }
}
```

- **Injection by interface (through StoreService interface):**
```typescript
// BaseCrudComponent depends on abstraction
export class BaseCrudComponent<T> {
  store: StoreService<T>;  // ← Abstraction, not concrete
  
  onDelete(rowData: T) {
    this.store.deleteFirebase(rowData);  // Works with any implementation
  }
}
```

- **provideIn: 'root' makes DI easy:**
```typescript
@Injectable({
  providedIn: 'root'  // Singleton at app level
})
export class SellStoreService implements StoreService<Sell> { ... }
```

---

### Project SOLID Summary

| Principle | How it's applied |
|-----------|------------------|
| **S** | Each class has clear responsibility (Store = state, Firebase = persistence) |
| **O** | BaseCrudComponent and DatatableComponent extensible without modification |
| **L** | Any StoreService<T> can substitute for StoreService<T> |
| **I** | Separate interfaces: StoreService, FirebaseService |
| **D** | Components depend on interfaces, not concrete implementations |

**Interview line:** *"I didn't use patterns just for the sake of it. I applied SOLID because the project will grow: if tomorrow I change Firebase to REST, I only modify FirebaseService. If I need a new table, I extend BaseCrudComponent. That's architecture that scales."*

---

## Interview Summary

Points 8 and 13 are the most impactful for a senior:

- **Point 8 (Dynamic Components):** Shows you can go beyond static HTML. On mobile, the table doesn't exist visually - it transforms into dynamically rendered cards. This is component architecture, not just CSS responsive design.

- **Point 13 (Generic Base Components):** Demonstrates you think about scale. If you add 10 more features tomorrow, CRUD logic is already solved. You just define the model and columns. That's what a senior does: lay foundations so the team can be productive.

**Closing line:** *"I didn't choose these techniques because they're trendy, but because they solve real problems: performance (OnPush + Signals), maintainability (generic base components), and UX (dynamic components for mobile)."*
