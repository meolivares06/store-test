# Puntos Clave para Entrevista Senior Angular

Este documento analiza un proyecto Angular 19 preparado para entrevistas level senior.

---

## 1. Angular 19 + Signals

- Uso de `signal()` para estado reactivo (`sell-store.service.ts:13`)
- `signal()` con `.update()` y `.set()` para mutación
- Modern `inject()` en vez de inyección en constructor
- **Detalle técnico:**

```typescript
// sell-store.service.ts
export class SellStoreService implements StoreService<Sell> {
  firebaseService = inject(SellFirebaseService);
  list = signal<Sell[]>([]);  // Signal typed
  loading = false;

  add(item: Sell): void {
    this.list.update(l => [...l, item]);  // Inmutabilidad
  }
}
```

- **Por qué importa:** Angular 19 hace de signals el default. Un senior debe saber cuándo usar signals vs observables (signals para estado de UI síncrono, observables para flujos asíncronos).
- **Pattern:** Este store es un "Signal Store" liviano - no usa NgRx/Signals de Angular, pero captura la esencia: estado reactivo con actualización automática.

---

## 2. Patrón Store Genérico

- Interfaz `StoreService<T>` (`basecrud.model.ts:5-27`) con tipo genérico
- Implementación en cada feature (Sell, Client, Product)
- Separa lógica de estado de Firebase

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

- **Detalle:** Cada feature implementa esta interfaz (`ClientStoreService`, `SellStoreService`, `ProductStoreService`)
- **Ventaja:** Si mañana cambia Firebase por REST API, solo se modifica `FirebaseService`, el store queda intacto.

---

## 3. ChangeDetectionStrategy.OnPush

- Todos los componentes lo usan (base-crud, datatable, base-form)
- Optimización crítica para performance
- **Detalle técnico:**

```typescript
@Component({
  selector: 'app-base-crud',
  changeDetection: ChangeDetectionStrategy.OnPush  // ← Importante
})
export class BaseCrudComponent<T> implements OnDestroy { ... }
```

- **Por qué funciona:** Con OnPush, Angular solo verifica el componente cuando:
  1. Input reference cambia
  2. Evento dentro del componente
  3. Signal observable-linked
  4. Async pipe en template
- **Combo fatal:** OnPush + Signals = cambio de detección casi zero-cost

---

## 4. Functional Interceptors (Angular 17+)

- `globalErrorsInterceptor` usa el nuevo patrón `HttpInterceptorFn` (`global-errors.interceptor.ts:7`)
- Interceptores funcionales vs clase antigua

```typescript
// Nueva forma (Angular 17+)
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

- **Registro en app.config.ts:**
```typescript
provideHttpClient(
  withFetch(), 
  withInterceptors([globalErrorsInterceptor])
)
```

- **Por qué es mejor:** Más testable, tree-shakeable, composable (encadenar múltiples interceptors fácil).

---

## 5. AngularFire + Firebase

- Integración completa con Firestore
- `provideFirebaseApp()` + `provideFirestore()` en app config
- **Configuración:**

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

- **Firebase Service genérico:**
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

- **Adapter pattern:** `sellAdapter` transforma datos de Firestore (con Timestamp) a objetos JS plain.

---

## 6. Custom Structural Directive

- Directiva con `effect()` y signals (`custom-structural.directive.ts:11-18`)
- TemplateRef + ViewContainerRef para renderizado dinámico

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

- **Uso en template:**
```html
<ng-template appCustomStructural [showIfAdmin]="isAdmin">
  <p>Contenido solo para admins</p>
</ng-template>
```

- **Por qué es powerful:** Las directivas estructurales personalizadas permiten lógica de renderizado compleja que ngIf no puede manejar.

---

## 7. Resolvers Funcionales

- `ResolveFn<Sell[]>` en lugar de clase (`sell.resolver.ts:7`)
- Usa `inject()` y `firstValueFrom`

```typescript
// sell.resolver.ts
export const sellResolver: ResolveFn<Sell[]> = (route, state) => {
  const store = inject(SellStoreService);

  if (store.list().length > 0) {
    return store.list();  // Cache del store
  } else {
    return firstValueFrom(of([]).pipe(
      switchMap(() => store.getFirebase())
    ));
  }
};
```

- **Pattern clave:** Verifica si el store ya tiene datos (evita llamada extra a Firebase) - optimizaciones que un senior considera.

---

## 8. Dynamic Components

- `ViewContainerRef.createComponent()` para rendering dinámico de cards (`datatable.component.ts:124`)
- El componente `DatatableComponent` detecta si está en mobile y renderiza componentes `CardMobileComponent` dinámicamente
- Usa `ComponentRef` + `setInput()` para pasar datos al componente hijo
- **Detalle técnico completo:**

```typescript
private loadContent() {
  this.value.forEach(item => {
    // Crear referencia al componente dinámicamente
    const cmpRef: ComponentRef<CardMobileComponent<typeof item>> = 
      this.viewContainer.createComponent(this.cardItem);
    
    // Pasar input al componente hijo (nuevo método Angular 16+)
    cmpRef.setInput('oneItem', item);
    
    // Forzar detección de cambios en el componente hijo
    cmpRef.changeDetectorRef.detectChanges();
  });
}
```

- **Por qué es interesante:** Este patrón permite renderizar diferentes componentes según el contexto (responsive design a nivel de componente, no solo CSS), útil para mobile-first donde la tabla se convierte en cards.

## 9. Path Aliases

- `@app`, `@feat`, `@shared` configurados en tsconfig
- Clean imports
- **Configuración en tsconfig.json:**

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

- **Uso:**
```typescript
import {Sell} from '@feat/sell/sell.model';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
```

- **Beneficio:** Import paths cortos, refactors fáceis,很清楚知道de dónde viene cada módulo.

---

## 10. Global Error Handling

- `ErrorHandler` custom (`GlobalErrorHandler`)
- Validator personalizado para CPF (`cpf.validator.ts`)
- **Global Error Handler:**

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

- **Registro:**
```typescript
// app.config.ts
{provide: ErrorHandler, useClass: GlobalErrorHandler, deps: [MessageService]}
```

- **Validator CPF:**
```typescript
import { validateBr, utilsBr } from 'js-brasil';

export const cpf: ValidatorFn = (control: AbstractControl): Record<string, boolean> | null => {
  if (utilsBr.isPresent(Validators.required(control))) {
    return null;
  }
  return validateBr['cpf'](control.value) ? null : {cpf: true};
};
```

- **Por qué importa:** Un senior sabe que el error handling no es opcional - debe ser centralized y user-friendly.

---

## 11. SSR/SSG

- Angular SSR configurado (`@angular/ssr`)
- `provideClientHydration()` disponible
- **Configuración:**

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideClientHydration() ← disponible si se necesita
  ]
};
```

- **Paquetes instalados:** `@angular/ssr`, `@angular/platform-server`
- **Scripts:**
```json
{
  "serve:ssr:storetest": "node dist/storetest/server/server.mjs"
}
```

- **Por qué es importante:** SSR mejora SEO y FCP (First Contentful Paint), crítico para e-commerce.

---

## 12. Lazy Loading

- `loadChildren: () => import(...)` en rutas (`app.routes.ts:6`)
- **Detalle:**

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

- **Ventajas:**
  - Code splitting automático
  - Solo carga lo que el usuario necesita
  - Tamaño de bundle reducido

---

## 13. Base Components Reutilizables

- **`BaseCrudComponent<T>` y `BaseFormComponent<T>` genéricos**
- Patrón template method con métodos abstractos que las clases hijo implementan

### BaseCrudComponent (base-crud.component.ts)

```typescript
export class BaseCrudComponent<T> implements OnDestroy {
  store: StoreService<T>;
  subscriptions: Subscription[] = [];
  cols: Column[] = [];
  cardItem: Type<any>;

  // Métodos abstractos que cada feature implementa
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
  dialogConfigService = inject(DynamicDialogConfig);
  storeService: StoreService<T>;

  // Template method: cada hijo define su form
  initForm(data?: any): void {
    throw new Error('Init form must be implemented');
  }

  // Lógica de save/updates reutilizable
  onSave(): void { ... }
}
```

**Ejemplo de implementación en hijo:**

```typescript
// En SellComponent que extiende BaseCrudComponent<Sell>
onEdit(rowData: Sell): void {
  this.ref = this.dialogService.open(SellFormComponent, {
    header: 'Editar Venda',
    data: rowData
  });
}
```

- **Por qué es importante para senior:** Demuestra conocimiento de:
  - **Genéricos en TypeScript** (`<T>`)
  - **Patrón Template Method** (definir esqueleto, dejar implementación a hijos)
  - **DRY (Don't Repeat Yourself)** - lógica CRUD reutilizable
  - **Inversión de control** - el componente padre orchestra, el hijo personaliza
  - **Interfaces vs Implementación** - desacoplamiento

---

## Aplicación de SOLID en los Módulos

El proyecto aplica los principios SOLID de forma práctica, no teórica:

### Estructura de Carpetas

```
src/app/
├── core/                    # 🔴 Core (SRP: única responsabilidad)
│   ├── adapters/           # Transformación de datos
│   ├── directives/          # Directivas reutilizables
│   ├── errors/             # Manejo global de errores
│   ├── interceptors/       # HTTP interceptors
│   ├── pipes/              # Pipes reutilizables (CPF, CEP)
│   └── validators/         # Validators personalizados
│
├── features/               # 🔵 Features (cada carpeta = un dominio)
│   ├── client/
│   │   ├── services/       # ClientStoreService
│   │   ├── resolver/
│   │   ├── component/      # List, Form
│   │   └── client.model.ts
│   ├── sell/
│   └── product/
│
├── shared/                 # 🟢 Shared (código reutilizable)
│   └── components/
│       ├── base-crud/      # Base genérica para CRUD
│       ├── base-form/      # Base genérica para formularios
│       └── datatable/      # Componente tabla genérico
│
└── layout/                 # 🟡 Layout (shell de la app)
```

---

### S - Single Responsibility Principle (Responsabilidad Única)

**Definición:** Una clase debe tener una sola razón para cambiar.

**Aplicación en el proyecto:**

| Clase | Responsabilidad | ¿Por qué cumple SRP? |
|-------|-----------------|---------------------|
| `SellStoreService` | Gestionar estado de ventas | Solo hace una cosa: estado + sync con Firebase |
| `SellFirebaseService` | Comunicar con Firestore | No conoce el estado, solo hace CRUD |
| `cpf.validator.ts` | Validar CPF | Una sola validación |
| `sellAdapter` | Transformar datos | Solo transforma, no persiste |
| `GlobalErrorHandler` | Mostrar errores | Solo maneja errores globales |

**Ejemplo - No violar SRP:**
```typescript
// Correcto: Separación de responsabilidades
// solo-firebase.ts
export class SellFirebaseService {
  get(): Observable<Sell[]> { ... }
}

// solo-store.ts
export class SellStoreService {
  list = signal<Sell[]>([]);  // Solo estado
  addFirebase(rawValue) { 
    return this.firebaseService.add(rawValue).pipe(
      tap(result => this.add({id: result, ...rawValue}))
    );
  }
}
```

---

### O - Open/Closed Principle (Abierto/Cerrado)

**Definición:** Entidades de software deben estar abiertas para extensión pero cerradas para modificación.

**Aplicación:**

- **`DatatableComponent` abierto para extensión:**
```typescript
// datatable.component.ts
@Input() cardItem: Type<any>;  // ← Extiende con cualquier componente
@Input() cols = cols;

// El componente detecta mobile y renderiza cardItem dinámicamente
private loadContent() {
  const cmpRef = this.viewContainer.createComponent(this.cardItem);
  cmpRef.setInput('oneItem', item);
}
```

- **Base components extensible:**
```typescript
// Las clases hijo EXTENDEN el comportamiento sin modificar la base
export class SellComponent extends BaseCrudComponent<Sell> {
  onEdit(rowData: Sell) { /* custom */ }
  onCreate() { /* custom */ }
}
```

- **Pipes agregados nuevos sin modificar existentes:**
```typescript
// Solo se agrega, no se toca el pipe existente
import {CepPipe, CpfCnpjPipe} from '@app/core/pipes/';
```

---

### L - Liskov Substitution Principle (Sustitución de Liskov)

**Definición:** Objetos de una clase base deben poder ser reemplazados por objetos de subclases sin alterar el funcionamiento.

**Aplicación:**

- **StoreService implementable por cualquier feature:**
```typescript
// basecrud.model.ts - Interfaz base
export interface StoreService<T> {
  list: WritableSignal<T[]>;
  add(item: T): void;
  // ...
}

// Cualquier clase que implemente esta interfaz funciona igual
export class ClientStoreService implements StoreService<Client> { ... }
export class SellStoreService implements StoreService<Sell> { ... }
export class ProductStoreService implements StoreService<Product> { ... }
```

- **FirebaseService inyectable:**
```typescript
export interface FirebaseService<T> {
  firestore: Firestore;
  get(): Observable<T[]>;
  add(data: T): Observable<string>;
  // ...
}

// Todas las implementaciones son intercambiables
export class SellFirebaseService implements FirebaseService<Sell> { ... }
export class ClientFirebaseService implements FirebaseService<Client> { ... }
```

---

### I - Interface Segregation Principle (Segregación de Interfaces)

**Definición:** Es mejor muchas interfaces específicas que una interface general.

**Aplicación:**

- **Interfaces separadas para cada responsabilidad:**
```typescript
// StoreService - solo gestión de estado
export interface StoreService<T> {
  list: WritableSignal<T[]>;
  add(item: T): void;
  remove(id: string): void;
  // No conoce Firestore
}

// FirebaseService - solo persistencia
export interface FirebaseService<T> {
  firestore: Firestore;
  basePath: string;
  get(): Observable<T[]>;
  add(data: T): Observable<string>;
  // No conoce el estado local
}
```

- **En el store se usan ambas interfaces:**
```typescript
export class SellStoreService implements StoreService<Sell> {
  firebaseService = inject(SellFirebaseService);  // Inyecta la otra interfaz
  // ...
}
```

---

### D - Dependency Inversion Principle (Inversión de Dependencias)

**Definición:** Depender de abstracciones, no de concreciones.

**Aplicación:**

- **Store depende de interfaz, no de implementación concreta:**
```typescript
export class SellStoreService implements StoreService<Sell> {
  // ✅ Depende de la interfaz FirebaseService
  firebaseService = inject(SellFirebaseService);
  
  // ✅ No importa qué implementación sea, mientras cumpla la interfaz
  addFirebase(rawValue: any): Observable<string> {
    return this.firebaseService.add(rawValue);  // Polymorphism
  }
}
```

- **Inyección por interfaz (a través de la interfaz StoreService):**
```typescript
// BaseCrudComponent depende de abstracción
export class BaseCrudComponent<T> {
  store: StoreService<T>;  // ← Abstraction, no concreta
  
  onDelete(rowData: T) {
    this.store.deleteFirebase(rowData);  // Funciona con cualquier implementación
  }
}
```

- **provideIn: 'root' facilita el DI:**
```typescript
@Injectable({
  providedIn: 'root'  // Singleton a nivel app
})
export class SellStoreService implements StoreService<Sell> { ... }
```

---

### Resumen SOLID del Proyecto

| Principio | Cómo se aplica |
|-----------|----------------|
| **S** | Cada clase tiene una responsabilidad clara (Store = estado, Firebase = persistencia) |
| **O** | BaseCrudComponent y DatatableComponent extensibles sin modificar |
| **L** | Cualquier StoreService<T> puede sustituir a StoreService<T> |
| **I** | Interfaces separadas: StoreService, FirebaseService |
| **D** | Componentes dependen de interfaces, no de implementaciones concretas |

**Frase para entrevista:** *"No usé patrones por usarlos. Apliqué SOLID porque el proyecto va a crecer: si mañana cambio Firebase por REST, solo modifico FirebaseService. Si necesito una nueva tabla, extiendo BaseCrudComponent. eso es arquitectura que escala."*

---

## Resumen para la Entrevista

Los puntos 8 y 13 son los más impactantes para un senior:

- **Punto 8 (Dynamic Components):** Muestra que sabés ir más allá del HTML estático. En mobile, la tabla no existe visualmente - se transforma en cards renderizadas dinámicamente. Esto es arquitectura de componentes, no solo CSS responsive.

- **Punto 13 (Base Components Genéricos):** Demuestra que pensás en escala. Si mañana agregás 10 features más, la lógica CRUD ya está resuelta. Solo definís el modelo y los columns. Eso es lo que un senior hace: sentar bases para que el equipo sea productivo.

**Frase para cerrar:** *"No elegí estas técnicas porque están de moda, sino porque resuelven problemas reales: performance (OnPush + Signals), mantenibilidad (base components genéricos), y UX (dynamic components para mobile)."*
