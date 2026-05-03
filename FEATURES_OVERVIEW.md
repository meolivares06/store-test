# Descripción General de Features - Store Test

## Visión General del Proyecto
Este proyecto es una aplicación web de gestión de tienda que permite administrar clientes, productos y ventas. Está construida con Angular y cuenta con un sistema robusto de manejo de errores HTTP, validación de respuestas del servidor, y datos mock para facilitar el desarrollo sin necesidad de un backend completamente funcional.

---

## Features Implementadas

### 1. **Sistema de Manejo Global de Errores HTTP**

**Propósito**: Centralizar la gestión de todos los errores HTTP en toda la aplicación de manera consistente.

**¿Qué hace?**:
- Intercepta automáticamente todas las peticiones HTTP realizadas por la aplicación
- Detecta el tipo de error ocurrido (red, validación, servidor, autorización, etc.)
- Muestra notificaciones visuales al usuario mediante mensajes emergentes
- Usa la librería PrimeNG para mostrar los mensajes de error de forma consistente

**Tipos de Errores Manejados**:

1. **Errores de Conectividad (Status 0)**
   - Cuando el usuario no tiene conexión a internet o la red está caída
   - Mensaje: "Please check your internet connection"
   - Duración: 5 segundos

2. **Errores de Validación de Parámetros (Status 400 o 422)**
   - Cuando los parámetros enviados al servidor no son válidos
   - Extrae el mensaje de error del servidor si está disponible
   - Mensaje: "The request contains invalid parameters. Please check and try again."
   - Duración: 5 segundos

3. **Errores del Servidor (Status 500 o 503)**
   - Cuando hay un problema en el servidor
   - Notifica al usuario que hay un problema temporal

4. **Errores de Autenticación (Status 401)**
   - Cuando el usuario no está autenticado o la sesión expiró
   - Puede redirigir al login

5. **Errores de Autorización (Status 403)**
   - Cuando el usuario no tiene permisos para acceder a un recurso

6. **Recurso No Encontrado (Status 404)**
   - Cuando se intenta acceder a un recurso que no existe

7. **Método No Permitido (Status 405)**
   - Cuando se usa un método HTTP no permitido para un recurso

8. **Tipo de Contenido No Soportado (Status 415)**
   - Cuando se envía un formato de datos no soportado por el servidor

9. **Entidad No Procesable (Status 422)**
   - Cuando los datos enviados no pueden ser procesados

**Cómo funciona**:
- Utiliza un patrón de cadena de responsabilidad (Chain of Responsibility)
- Cada tipo de error tiene su propio "handler" o manejador
- El interceptor pasa el error por cada handler hasta que uno lo procese
- Una vez procesado, el error se detiene para evitar cascadas de notificaciones

**Beneficios**:
- No necesitas manejar errores en cada componente
- Los mensajes son consistentes en toda la aplicación
- El usuario siempre recibe feedback claro sobre qué salió mal
- Facilita el debugging al loguear los errores en consola

---

### 2. **Validación de Respuestas del Servidor**

**Propósito**: Garantizar que las respuestas recibidas del servidor cumplan con el formato y estructura esperada por la aplicación.

**¿Qué hace?**:
- Valida que la estructura de datos devuelta por el servidor sea la correcta
- Si la respuesta no coincide con el formato esperado, muestra un error al usuario
- Usa TypeScript type guards para validar de forma segura
- Evita que la aplicación procese datos inválidos o corruptos

**Ejemplo**:
- Si esperamos recibir un objeto con propiedades específicas pero recibimos otro formato, el validador lo detecta
- Muestra un error: "The response format is invalid."
- La aplicación no procesa datos malos

**Beneficios**:
- Mayor seguridad en los datos
- Detección temprana de problemas en la API
- Evita errores en cascada causados por datos malformados

---

### 3. **Gestión de Datos Mock (Simulados)**

**Propósito**: Proporcionar datos de prueba completos para que el equipo pueda desarrollar y probar la aplicación sin necesidad de un backend completamente funcional.

**¿Qué hace?**:
- Genera automáticamente 40 clientes ficticios
- Genera automáticamente 40 productos ficticios
- Genera automáticamente 40 ventas ficticios que relacionan clientes con productos
- Los datos son aleatorios pero realistas

**Datos de Clientes Mock**:
- Código único para cada cliente (C-1000, C-1001, etc.)
- Nombre completo
- CPF (número de documento)
- Dirección completa con:
  - CEP (código postal)
  - Logradouro (calle)
  - Número y complemento
  - Barrio y ciudad
- Email
- Fecha de nacimiento

**Datos de Productos Mock**:
- Código único (P-2000, P-2001, etc.)
- Nombre descriptivo
- Valor/precio (aleatorio entre 10 y 110)

**Datos de Ventas Mock**:
- Código único (S-3000, S-3001, etc.)
- Fecha de creación
- Referencia al cliente que realizó la compra
- Referencia al producto vendido
- Total de la venta (calculado basado en el valor del producto)

**Características especiales**:
- Los IDs se omiten intencionalmente para evitar conflictos con los IDs de Firebase
- Los valores son aleatorios pero realistas
- Las relaciones entre clientes, productos y ventas son consistentes

**Beneficios**:
- Desarrollo más rápido sin esperar el backend
- Pruebas visuales completas sin datos reales
- Facilita identificar problemas de UI/UX

---

### 4. **Modelos de Datos**

**Propósito**: Definir la estructura y tipos de datos que se usan en toda la aplicación.

**Modelo de Cliente (Client)**:
```
- id: Identificador único
- code: Código de cliente para referencia humana
- name: Nombre completo
- cpf: Documento de identidad
- address: Objeto con información de dirección
- email: Correo electrónico
- birthday: Fecha de nacimiento
```

**Modelo de Dirección (Address)**:
```
- cep: Código postal
- logradouro: Nombre de la calle
- no: Número
- bairro: Barrio
- complemento: Información adicional (apartamento, etc.)
- cidade: Nombre de la ciudad
```

**Modelo de Producto (Product)**:
```
- id: Identificador único
- code: Código de producto
- name: Nombre/descripción del producto
- value: Precio unitario
```

**Modelo de Venta (Sell)**:
```
- id: Identificador único
- code: Código de venta para referencia
- creationDate: Fecha en que se realizó la venta
- clientId: ID del cliente que realizó la compra
- productId: ID del producto vendido
- total: Valor total de la venta
```

**Beneficios**:
- Type safety con TypeScript
- Documentación clara de qué datos espera cada parte de la app
- Facilita cambios futuros de estructura
- Previene errores de tipos en tiempo de desarrollo

---

## Estructura de Carpetas Relacionadas

```
src/app/
├── core/
│   └── interceptors/
│       ├── errors.ts               (Handlers para cada tipo de error)
│       └── global-errors.interceptor.ts  (Interceptor principal)
├── features/
│   ├── client/
│   │   └── client.model.ts        (Definición de estructura de cliente)
│   ├── product/
│   │   └── product.model.ts       (Definición de estructura de producto)
│   └── sell/
│       └── sell.model.ts          (Definición de estructura de venta)
└── shared/
    └── mockdata.component.ts      (Componente que carga datos mock)

public/
└── mock/
    └── index.ts                   (Generador de datos mock)
```

---

## Flujo de Datos

### Cuando un usuario realiza una acción:
1. El componente realiza una petición HTTP (GET, POST, PUT, DELETE)
2. El `globalErrorsInterceptor` intercepta la petición
3. Se envía la petición al servidor
4. El servidor responde

### Si hay un error:
1. El interceptor captura el error
2. Busca el handler apropiado según el tipo de error
3. El handler muestra el mensaje de error al usuario
4. El usuario ve una notificación clara

### Si la respuesta es exitosa:
1. El interceptor valida que el formato sea correcto
2. Si es válido, la respuesta se entrega al componente que la solicitó
3. Si es inválido, muestra un error de validación

---

## Próximas Mejoras (Documentadas)
- [ ] Refactorización de código para mejor testabilidad
- [ ] Análisis de uso de injector en funciones sin dependencias
- [ ] Mejora de la documentación técnica de implementación
- [ ] Agregar más tipos de errores si es necesario
- [ ] Considerar persistencia de errores para auditoría
- [ ] Implementar retry automático para ciertos tipos de error

---

## Notas Importantes
- Los datos mock son generados en tiempo de ejecución, no son estáticos
- La validación de respuestas es extensible: puedes agregar más validadores según necesites
- El sistema de errores es escalable: puedes agregar nuevos handlers sin modificar el existente
- Los modelos de datos están tipados con TypeScript para mayor seguridad
