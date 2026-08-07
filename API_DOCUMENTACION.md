# 📘 Manual de Uso y Documentación de APIs (Caso Empleados PUCE)
## Materia: Arquitectura Empresarial (2026)

Este manual técnico detalla el funcionamiento, métodos y consumo de las APIs construidas para la gestión del talento humano de la PUCE.

---

## 🚀 1. Introducción
La **API de Empleados PUCE** es una interfaz de programación de aplicaciones (API) RESTful desarrollada sobre el framework **Laravel 11**. Su objetivo es servir como capa lógica y de datos (Backend) para el sistema de administración de empleados del departamento de Talento Humano.

### Características clave:
* **Autenticación Segura**: Uso de **JSON Web Tokens (JWT)** para proteger los recursos y endpoints de cálculo.
* **Lógica de Negocio Desacoplada**: Implementa un servicio específico para el cálculo preciso de edades, antigüedad y prestaciones laborales según las normativas vigentes de Ecuador (13er y 14to sueldo).
* **Interoperabilidad**: Retorna respuestas estandarizadas en formato **JSON** con códigos de estado HTTP apropiados (200, 201, 401, 404, 422).

---

## 🔑 2. Autenticación (JWT)

Para consumir cualquier endpoint del sistema (a excepción del login), el cliente debe autenticarse y adjuntar el token generado en las cabeceras HTTP de la siguiente manera:

* **Header**: `Authorization`
* **Valor**: `Bearer <TU_TOKEN_JWT>`

---

## 🛣️ 3. Catálogo de Endpoints

### 3.1. Iniciar Sesión (Login)
Permite a los administradores obtener un token JWT válido para consumir la API.

* **HTTP Method**: `POST`
* **Ruta**: `/api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Parámetros (Body JSON)**:
  | Campo | Tipo | Requerido | Descripción |
  | :--- | :--- | :--- | :--- |
  | `email` | `string` | Sí | Correo electrónico del administrador |
  | `password` | `string` | Sí | Contraseña de acceso |

* **Ejemplo de Petición (Request)**:
  ```json
  {
      "email": "admin@puce.edu.ec",
      "password": "password123"
  }
  ```

* **Ejemplo de Respuesta Correcta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "expires_in": 3600
  }
  ```

* **Ejemplo de Respuesta Incorrecta (Response - 401 Unauthorized)**:
  ```json
  {
      "status": "error",
      "message": "Credenciales incorrectas"
  }
  ```

---

### 3.2. Guardar Empleado (Requerimiento 1)
Registra un nuevo empleado en la base de datos de Talento Humano.

* **HTTP Method**: `POST`
* **Ruta**: `/api/empleados`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <TOKEN>`
* **Parámetros (Body JSON)**:
  | Campo | Tipo | Requerido | Reglas | Descripción |
  | :--- | :--- | :--- | :--- | :--- |
  | `nombre` | `string` | Sí | Máx 255 carac. | Nombres del empleado |
  | `apellido` | `string` | Sí | Máx 255 carac. | Apellidos del empleado |
  | `fecha_nacimiento` | `date` | Sí | Formato YYYY-MM-DD | Debe ser menor a hoy |
  | `fecha_ingreso` | `date` | Sí | Formato YYYY-MM-DD | Debe ser menor o igual a hoy |
  | `salario` | `numeric` | Sí | Mínimo 0 | Salario mensual asignado |

* **Ejemplo de Petición (Request)**:
  ```json
  {
      "nombre": "Santiago",
      "apellido": "Salazar",
      "fecha_nacimiento": "1994-08-25",
      "fecha_ingreso": "2023-01-15",
      "salario": 1250.00
  }
  ```

* **Ejemplo de Respuesta (Response - 201 Created)**:
  ```json
  {
      "status": "success",
      "message": "Empleado registrado con éxito",
      "data": {
          "id": 1,
          "nombre": "Santiago",
          "apellido": "Salazar",
          "fecha_nacimiento": "1994-08-25T00:00:00.000000Z",
          "fecha_ingreso": "2023-01-15T00:00:00.000000Z",
          "salario": "1250.00",
          "updated_at": "2026-08-07T05:00:00.000000Z",
          "created_at": "2026-08-07T05:00:00.000000Z"
      }
  }
  ```

---

### 3.3. Mostrar Empleados (Requerimiento 2)
Permite listar la totalidad de los empleados o consultar el detalle de uno en específico.

#### A. Listar Todos
* **HTTP Method**: `GET`
* **Ruta**: `/api/empleados`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "data": [
          {
              "id": 1,
              "nombre": "Santiago",
              "apellido": "Salazar",
              "fecha_nacimiento": "1994-08-25",
              "fecha_ingreso": "2023-01-15",
              "salario": "1250.00"
          }
      ]
  }
  ```

#### B. Obtener uno por ID
* **HTTP Method**: `GET`
* **Ruta**: `/api/empleados/{id}`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta Correcta (200 OK)**:
  ```json
  {
      "status": "success",
      "data": {
          "id": 1,
          "nombre": "Santiago",
          "apellido": "Salazar",
          "fecha_nacimiento": "1994-08-25",
          "fecha_ingreso": "2023-01-15",
          "salario": "1250.00"
      }
  }
  ```

---

### 3.4. Calcular la Edad (Requerimiento 3)
Calcula y retorna la edad biológica actual del empleado basándose en su fecha de nacimiento.

* **HTTP Method**: `GET`
* **Ruta**: `/api/empleados/{id}/edad`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "empleado": "Santiago Salazar",
      "fecha_nacimiento": "1994-08-25",
      "edad": 31
  }
  ```

---

### 3.5. Calcular la Antigüedad (Requerimiento 4)
Calcula la antigüedad exacta del empleado dentro de la PUCE desde su fecha de ingreso.

* **HTTP Method**: `GET`
* **Ruta**: `/api/empleados/{id}/antiguedad`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "empleado": "Santiago Salazar",
      "fecha_ingreso": "2023-01-15",
      "antiguedad": {
          "anios": 3,
          "meses": 6,
          "dias": 23,
          "texto": "3 años, 6 meses y 23 días"
      }
  }
  ```

---

### 3.6. Calcular Prestaciones (Requerimiento 5)
Calcula los valores proporcionales o completos del décimo tercer y décimo cuarto sueldo de acuerdo con su fecha de ingreso.

* **HTTP Method**: `GET`
* **Ruta**: `/api/empleados/{id}/prestaciones`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "empleado": "Santiago Salazar",
      "salario_base": "1250.00",
      "prestaciones": {
          "decimo_tercer_sueldo": 1250.00,
          "decimo_cuarto_sueldo": 450.00,
          "dias_calculados": 1298,
          "detalle": "Valores completos (más de 1 año de antigüedad)"
      }
  }
  ```

---

### 3.7. Aumentar el Salario (Requerimiento 6)
Actualiza el salario asignado a un empleado específico.

* **HTTP Method**: `PATCH`
* **Ruta**: `/api/empleados/{id}/salario`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <TOKEN>`
* **Parámetros (Body JSON)**:
  | Campo | Tipo | Requerido | Descripción |
  | :--- | :--- | :--- | :--- |
  | `salario` | `numeric` | Sí | Nuevo salario (mayor o igual a 0) |

* **Ejemplo de Petición (Request)**:
  ```json
  {
      "salario": 1400.00
  }
  ```

* **Ejemplo de Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Salario actualizado con éxito",
      "data": {
          "id": 1,
          "nombre": "Santiago",
          "apellido": "Salazar",
          "fecha_nacimiento": "1994-08-25",
          "fecha_ingreso": "2023-01-15",
          "salario": "1400.00"
      }
  }
  ```

---

### 3.8. Eliminar Empleado (Requerimiento 7)
Elimina físicamente el registro de un empleado de la base de datos de la PUCE.

* **HTTP Method**: `DELETE`
* **Ruta**: `/api/empleados/{id}`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (Response - 200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Empleado eliminado correctamente"
  }
  ```

---

## 💻 4. Ejemplo de Consumo en JS (Frontend web/móvil)

Aquí tienes un fragmento de código usando JavaScript y `fetch` para consumir la API e imprimir los décimos de un empleado en pantalla:

```javascript
const token = "TU_TOKEN_JWT_AQUI";
const empleadoId = 1;

fetch(`http://proyecto_arquitectura_empresarial_2026.test/api/empleados/${empleadoId}/prestaciones`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
})
.then(response => response.json())
.then(data => {
    if (data.status === "success") {
        console.log(`Empleado: ${data.empleado}`);
        console.log(`Décimo Tercero: $${data.prestaciones.decimo_tercer_sueldo}`);
        console.log(`Décimo Cuarto: $${data.prestaciones.decimo_cuarto_sueldo}`);
    } else {
        console.error("Error al obtener prestaciones:", data.message);
    }
})
.catch(error => console.error("Error de red:", error));
```
