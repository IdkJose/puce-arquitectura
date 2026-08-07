# 🚀 Sistema de Administración de Empleados PUCE - Backend

Este es el proyecto de backend y API REST desarrollado para el departamento de Talento Humano de la PUCE, como parte de la materia de **Arquitectura Empresarial (2026)**. Cuenta con seguridad mediante tokens **JWT** y cálculos automáticos de décimos, edad y antigüedad.

El frontend está desarrollado con **Vue.js** (integrado mediante Inertia.js).

---

## 🛠️ Requisitos previos

Asegúrate de tener instalado en tu sistema:
* **PHP >= 8.2**
* **Composer**
* **Node.js & NPM**
* **SQLite** (u otro motor de base de datos)

---

## 💻 Pasos para levantar el proyecto en otra máquina

Sigue estos comandos en orden dentro de tu terminal para clonar y ejecutar el sistema desde cero:

### 1. Clonar el repositorio y entrar a la carpeta
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA>
```

### 2. Instalar las dependencias de PHP (Laravel)
```bash
composer install
```

### 3. Instalar las dependencias de JavaScript (Vue.js / Vite)
```bash
npm install
```

### 4. Configurar las variables de entorno
Crea una copia del archivo `.env.example` y nómbrala `.env`:
* **En Windows (PowerShell)**:
  ```powershell
  copy .env.example .env
  ```
* **En Linux / macOS**:
  ```bash
  cp .env.example .env
  ```

### 5. Generar las claves de seguridad
Ejecuta estos dos comandos para generar la firma de Laravel y la clave secreta de encriptación para los tokens JWT:
```bash
php artisan key:generate
php artisan jwt:secret
```

### 6. Ejecutar migraciones y sembrar base de datos
Este comando creará las tablas en SQLite y registrará automáticamente al usuario administrador de pruebas:
```bash
php artisan migrate --seed
```
* **Usuario Admin por defecto**: `admin@puce.edu.ec`
* **Contraseña**: `password123`

---

## 🏃‍♂️ Ejecución del Servidor

Para utilizar el sistema completo, debes iniciar tanto el servidor de backend (Laravel) como el compilador de frontend (Vite):

1. **Iniciar el Backend de Laravel**:
   ```bash
   php artisan serve
   ```
   *(Estará disponible en: http://127.0.0.1:8000)*

2. **Iniciar el compilador de Frontend (Vite/Vue)**:
   ```bash
   npm run dev
   ```

---

## 🧪 Pruebas de la API
En la raíz del proyecto cuentas con el archivo `PUCE_Empleado_API.postman_collection.json` listo para ser importado en **Postman** o **Bruno** para validar de inmediato todos los endpoints del backend con JWT.
