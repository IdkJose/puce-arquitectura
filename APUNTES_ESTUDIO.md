# 📓 Bitácora de Estudio: Backend de Empleados PUCE
## Materia: Arquitectura Empresarial (2026)

Este documento sirve como guía de estudio y registro del paso a paso del desarrollo del backend para el área de Talento Humano de la PUCE.

---

## 🏛️ 1. Arquitectura General del Proyecto

Hemos seleccionado la siguiente arquitectura:
* **Backend**: Laravel 11 / PHP 8.4 (enfoque API REST).
* **Frontend**: Vue.js (Laravel Inertia) que consumirá la API.
* **Seguridad**: Autenticación sin estado (Stateless) mediante tokens **JWT** (JSON Web Tokens).
* **Base de Datos**: **SQLite** (un archivo ligero local `database.sqlite`).

### ¿Cómo funciona la seguridad con JWT?
1. El cliente (Frontend) envía las credenciales de administrador (email y contraseña) a `/api/auth/login`.
2. El servidor valida las credenciales y, si son correctas, genera un **Token JWT** firmado con una clave secreta (`JWT_SECRET`).
3. El servidor devuelve el token al cliente.
4. Para cualquier consulta posterior (ej. listar empleados o calcular décimos), el cliente debe adjuntar el token en las cabeceras HTTP:
   `Authorization: Bearer <TOKEN>`
5. El servidor intercepta la petición, verifica la firma del token y, si es válida, procesa la solicitud.

---

## 🚀 2. Paso a Paso del Desarrollo

### Paso 1: Configuración Inicial de la Base de Datos (COMPLETADO)
Configuramos SQLite en el archivo `.env`:
```env
DB_CONNECTION=sqlite
```
*SQLite no necesita host, puerto, usuario ni contraseña. Laravel buscará o creará por defecto el archivo `database/database.sqlite`.*

### Paso 2: Instalación e Inicialización de JWT (COMPLETADO)
Instalamos el paquete `tymon/jwt-auth` y ejecutamos los comandos de publicación y generación de claves:

1. **Instalar el paquete**:
   ```bash
   composer require tymon/jwt-auth
   ```
2. **Publicar la configuración**:
   ```bash
   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
   ```
   *Esto crea el archivo `config/jwt.php`.*
3. **Generar la clave secreta**:
   ```bash
   php artisan jwt:secret
   ```
   *Esto añade la variable `JWT_SECRET` en el archivo `.env`.*

### Paso 3: Creación de Modelo y Migración del Empleado (COMPLETADO)
Ejecutamos el generador de Laravel para crear el modelo y la migración al mismo tiempo:
```bash
php artisan make:model Empleado -m
```

### Paso 4: Configuración de la Migración `create_empleados_table.php` (COMPLETADO)
Definimos los campos de la tabla `empleados` en el archivo `database/migrations/xxxx_xx_xx_xxxxxx_create_empleados_table.php`:
```php
public function up(): void
{
    Schema::create('empleados', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('apellido');
        $table->date('fecha_nacimiento');
        $table->date('fecha_ingreso');
        $table->decimal('salario', 10, 2);
        $table->timestamps();
    });
}
```

### Paso 5: Configuración del Modelo `Empleado.php` (COMPLETADO)
Agregamos protección de campos y casteo de tipos de datos en `app/Models/Empleado.php`:
```php
protected $fillable = [
    'nombre',
    'apellido',
    'fecha_nacimiento',
    'fecha_ingreso',
    'salario',
];

protected $casts = [
    'fecha_nacimiento' => 'date',
    'fecha_ingreso' => 'date',
    'salario' => 'decimal:2',
];
```
*Ejecutamos `php artisan migrate` para impactar los cambios en `database.sqlite`.*

### Paso 6: Creación del Servicio de Lógica de Negocio (COMPLETADO)
Creamos la clase `app/Services/CalculosLaboralesService.php` para centralizar la lógica de negocio (SOLID, separación de responsabilidades):
* `calcularEdad(CarbonInterface $fechaNacimiento): int` -> Calcula la edad basándose en la fecha de nacimiento usando la propiedad `$date->age` de Carbon.
* `calcularAntiguedad(CarbonInterface $fechaIngreso): array` -> Calcula el tiempo transcurrido desde la fecha de ingreso en años, meses y días.
* `calcularPrestaciones(float $salario, CarbonInterface $fechaIngreso): array` -> Calcula los décimos (décimo tercero y décimo cuarto). Para empleados con antigüedad superior a un año, entrega el bono completo ($450 para 14vo, y un salario completo para 13vo). Para empleados nuevos, calcula el proporcional a los días laborados.

> [!NOTE]
> **Lección de Arquitectura**: En Laravel 11, el casteo de fechas devuelve objetos de tipo `Carbon\CarbonImmutable` por defecto para garantizar que las fechas no sean mutadas accidentalmente durante operaciones lógicas. Por este motivo, el tipo de dato aceptado en el servicio se declaró usando la interfaz `Carbon\CarbonInterface`, la cual es el contrato padre que implementan tanto `Carbon` como `CarbonImmutable`. Esto evita errores de tipo (`TypeError`).

### Paso 7: Creación de `EmpleadoController.php` (COMPLETADO)
Ejecutamos el comando para crear el controlador API y programamos las acciones RESTful:
```bash
php artisan make:controller Api/EmpleadoController
```
* **Ubicación**: `app/Http/Controllers/Api/EmpleadoController.php`
* **Inyección**: Se inyecta `CalculosLaboralesService` mediante el constructor para resolver los cálculos de los empleados.
* **Acciones expuestas**:
  * `index()` -> Obtener lista de todos los empleados.
  * `store(Request)` -> Guardar empleado con validaciones requeridas de tipo y fechas.
  * `show($id)` -> Mostrar un empleado por su ID.
  * `calcularEdad($id)` -> Consumir lógica del servicio de edad.
  * `calcularAntiguedad($id)` -> Consumir lógica del servicio de antigüedad.
  * `calcularPrestaciones($id)` -> Consumir lógica de cálculo de décimo tercero y décimo cuarto.
  * `updateSalario(Request, $id)` -> Actualizar salario del empleado en la base de datos.
  * `destroy($id)` -> Eliminar empleado de la base de datos de manera física.

### Paso 8: Integración de JWT y Configuración de Guard (COMPLETADO)
1. Modificamos el modelo `User.php` para implementar la interfaz `JWTSubject` e incluimos los métodos requeridos: `getJWTIdentifier()` y `getJWTCustomClaims()`.
2. Configuramos el Guard `api` en `config/auth.php` con el driver `jwt`.
3. Creamos `app/Http/Controllers/Api/AuthController.php` con las acciones de `login()`, `me()`, `logout()` y `refresh()`.
4. Configuramos el enrutador de Laravel en `bootstrap/app.php` agregando el mapeo para rutas api: `api: __DIR__.'/../routes/api.php'`.
5. Creamos el archivo de rutas `routes/api.php` con las rutas de autenticación y las rutas protegidas para empleados con el middleware `auth:api`.
6. Modificamos `DatabaseSeeder.php` para crear un usuario administrador de pruebas:
   * **Usuario**: `admin@puce.edu.ec`
   * **Contraseña**: `password123`
