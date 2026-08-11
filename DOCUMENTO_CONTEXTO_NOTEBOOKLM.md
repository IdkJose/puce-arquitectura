# 📊 Documento de Contexto para NotebookLM: Proyecto Integrador PUCE - Arquitectura Empresarial

**Universidad**: Pontificia Universidad Católica del Ecuador (PUCE)  
**Materia**: Arquitectura Empresarial (2026)  
**Proyecto**: Sistema de Gestión de Talento Humano y Cálculo de Prestaciones Laborales (API Empleados PUCE)  
**Stack Principal**: Laravel 11 / PHP 8.4, JWT (JSON Web Tokens), SQLite, Inertia.js / Vue.js, Vite  

---

## 🎯 1. Resumen Ejecutivo y Objetivos del Proyecto

El proyecto **PUCE Arquitectura - Módulo de Empleados** es una solución empresarial desacoplada desarrollada para modernizar la gestión del departamento de Talento Humano de la universidad. 

### Objetivos Principales:
1. **Centralización y Administración de Empleados**: Permitir el registro, consulta, actualización de salarios y eliminación de la nómina de empleados.
2. **Cálculo Automatizado de Prestaciones y Antigüedad**: Implementar la lógica de negocio conforme a la legislación laboral del Ecuador para calcular:
   - **Edad Biológica** del empleado.
   - **Antigüedad exacta** (Años, Meses y Días trabajados en la universidad).
   - **Prestaciones Sociales**: Décimo Tercer Sueldo (Bono navideño) y Décimo Cuarto Sueldo (Bono escolar), contemplando valores completos o proporcionales según los días laborados.
3. **Seguridad Stateless (Sin Estado)**: Proteger todos los endpoints del backend utilizando la especificación **JWT (JSON Web Token)**.

---

## 🏛️ 2. Arquitectura del Sistema y Patrones de Diseño

El sistema sigue una **Arquitectura en Capas (Layered Architecture)** con separación clara de responsabilidades:

```
[ Cliente Web / Móvil / Postman ]
               │ (HTTP Request + Bearer JWT Token)
               ▼
[ Enrutador API & Middleware (auth:api) ]
               │
               ▼
[ Controladores API (EmpleadoController / AuthController) ]
               │
               ▼
[ Capa de Servicio (CalculosLaboralesService) ] ── (Lógica de Negocio Laboral)
               │
               ▼
[ Capa de Datos (Modelos Eloquent & SQLite Database) ]
```

### Decisión de Componentes Técnicos:
* **Backend Framework**: **Laravel 11** en PHP 8.4. Garantiza un enrutamiento rápido, inyección de dependencias nativa y ORM Eloquent eficiente.
* **Mecanismo de Autenticación**: **JWT Auth (`tymon/jwt-auth`)**. Permite autenticación *stateless*, facilitando la integración con cualquier cliente frontend (Vue, React, aplicaciones móviles o microservicios externos).
* **Motor de Base de Datos**: **SQLite**. Base de datos relacional ligera basada en archivos (`database/database.sqlite`), ideal para despliegues portables y entornos de pruebas integradoras.
* **Capa de Servicios (`CalculosLaboralesService`)**: Sigue el principio de **Responsabilidad Única (SOLID)**. La lógica de cálculo de antigüedad y décimos no reside en los controladores ni en las vistas, sino en un servicio aislado.

---

## 🔑 3. Seguridad y Flujo de Autenticación (JWT)

1. **Solicitud de Token**: El usuario envía sus credenciales al endpoint `/api/auth/login`.
2. **Firma Digital**: El backend valida el usuario y emite un token firmado con la clave secreta `JWT_SECRET`.
3. **Cabecera de Autorización**: Para consumir endpoints protegidos, el cliente adjunta en la petición:
   `Authorization: Bearer <TOKEN_JWT>`
4. **Validación de Middleware**: El middleware `auth:api` intercepta la petición, verifica la validez del token y concede el acceso.

---

## 🛣️ 4. Catálogo de Servicios y APIs Expuestas

| Método HTTP | Ruta API | Descripción / Propósito | Middleware / Seguridad |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener token JWT | Público |
| `GET` | `/api/empleados` | Listar todos los empleados registrados | Protegido (`auth:api`) |
| `POST` | `/api/empleados` | Registrar un nuevo empleado | Protegido (`auth:api`) |
| `GET` | `/api/empleados/{id}` | Consultar detalle de un empleado por ID | Protegido (`auth:api`) |
| `GET` | `/api/empleados/{id}/edad` | Obtener la edad biológica calculada | Protegido (`auth:api`) |
| `GET` | `/api/empleados/{id}/antiguedad` | Obtener tiempo trabajado (años, meses, días) | Protegido (`auth:api`) |
| `GET` | `/api/empleados/{id}/prestaciones` | Obtener cálculo de 13er y 14to sueldo | Protegido (`auth:api`) |
| `PATCH` | `/api/empleados/{id}/salario` | Actualizar el salario asignado al empleado | Protegido (`auth:api`) |
| `DELETE` | `/api/empleados/{id}` | Eliminar físicamente un empleado | Protegido (`auth:api`) |

---

## ⚙️ 5. Reglas de Negocio Laborales (Ecuador)

1. **Décimo Tercer Sueldo (Bono Navideño)**:
   - Equivalente a la doceava parte de las remuneraciones recibidas en el año.
   - Si el empleado tiene más de 1 año de antigüedad, recibe el salario completo mensual.
   - Si tiene menos de 1 año, se calcula el valor proporcional basado en los días exactos transcurridos desde su fecha de ingreso.

2. **Décimo Cuarto Sueldo (Bono Escolar)**:
   - Corresponde a un Salario Básico Unificado (SBU) fijado en $450.00 USD.
   - Si el empleado tiene más de 1 año de antigüedad, recibe el bono completo ($450.00).
   - Si tiene menos de 1 año, se calcula el proporcional en relación con los días trabajados sobre el año laboral (360 días).

3. **Inmutabilidad de Fechas**:
   - En Laravel 11, las fechas se procesan usando objetos `CarbonImmutable` implementando `CarbonInterface` para prevenir alteraciones imprevistas de estado durante los cálculos de antigüedad.

---

## 🎤 6. Guion Recomendado para la Presentación del Proyecto

### Diapositiva 1: Introducción y Planteamiento
* Presentar el tema: *Sistema Integrador de Arquitectura Empresarial para la Gestión de Empleados PUCE*.
* Explicar el reto: Automatizar el cálculo de beneficios de nómina mediante una API segura y desacoplada.

### Diapositiva 2: Decisiones Arquitectónicas
* Justificar la elección de **Laravel 11 + JWT**: Garantiza escalabilidad, seguridad basada en tokens y facilidad de consumo desde múltiples plataformas.
* Destacar la arquitectura de capas y el patrón **Service Layer** (`CalculosLaboralesService`) para mantener el código mantenible y limpio.

### Diapositiva 3: Demostración Funcional
* Mostrar el flujo de autenticación JWT mediante Postman/Frontend.
* Ejemplo del endpoint `/api/empleados/{id}/prestaciones` mostrando el cálculo transparente de antigüedad y décimos.

### Diapositiva 4: Extensión Móvil (React Native + TypeScript)
* Demostrar la naturaleza **desacoplada y multiplataforma** del backend en Laravel 11.
* Presentar la arquitectura del cliente móvil en **React Native (Expo)**, el cual almacena el token JWT de manera segura (`AsyncStorage`) y consume el cálculo de décimos desde teléfonos iOS y Android.

### Diapositiva 5: Conclusiones y Beneficios
* Reducción de errores manuales en los cálculos de talento humano.
* Cumplimiento estricto de normativas legales del Ecuador.
* Sistema listo para ser integrado con módulos de RRHH, cliente web Vue 3 y cliente móvil React Native.

---

## 📱 7. Arquitectura del Cliente Móvil (React Native + Expo)

1. **Stack Técnico**: React Native, Expo, TypeScript, `@react-native-async-storage/async-storage`.
2. **Flujo de Consumo JWT**:
   - `LoginScreen`: Envia credenciales a `POST /api/auth/login` y guarda el token en `AsyncStorage`.
   - `HomeScreen`: Lista empleados y consulta `GET /api/empleados/{id}/prestaciones` enviando la cabecera `Authorization: Bearer <TOKEN>`.

