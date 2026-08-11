# 🚀 Sistema de Gestión de Empleados y Cálculos Laborales (PUCE 2026)

Este proyecto es una solución integral para el **Cálculo de Décimo Tercer y Décimo Cuarto Sueldo** de empleados en Ecuador, compuesta por:
- 🐘 **Backend REST API**: Laravel 11 / PHP 8.4 con autenticación JWT (`tymon/jwt-auth`).
- 💻 **Frontend Web**: React 19 + Inertia.js + Tailwind CSS.
- 📱 **Aplicación Móvil**: React Native + Expo (SDK 54) + TypeScript.

---

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu computadora:

- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [PHP](https://www.php.net/) (Versión 8.2 o superior)
- [Composer](https://getcomposer.org/)
- **App móvil Expo Go** (Opcional, instalada en tu teléfono iOS o Android desde la App Store / Play Store)

---

## 🛠️ Paso 1: Configuración e Instalación del Backend (Laravel)

1. **Clonar o abrir el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd proyecto_arquitectura_empresarial_2026
   ```

2. **Instalar dependencias de PHP (Composer)**:
   ```bash
   composer install
   ```

3. **Configurar el archivo de entorno (`.env`)**:
   Copia el archivo de ejemplo a `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Generar claves de la aplicación y JWT**:
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```

5. **Preparar la base de datos y cargar datos iniciales**:
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Esto creará la base de datos SQLite/MySQL y creará el usuario administrador:*
   - **Email**: `admin@puce.edu.ec`
   - **Contraseña**: `password123`

---

## 💻 Paso 2: Configuración e Instalación del Frontend Web (React)

1. **Instalar dependencias de Node.js en la raíz**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Web**:
   ```bash
   npm run dev
   ```

3. **Iniciar el servidor Backend de Laravel (Escuchando en la red local)**:
   Abre **otra terminal** en la raíz del proyecto y ejecuta:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
   > 🌐 **Acceso Web**: Abre tu navegador e ingresa a `http://localhost:8000`.

---

## 📱 Paso 3: Configuración e Instalación de la App Móvil (React Native)

1. **Navegar a la carpeta `mobile` e instalar dependencias**:
   ```bash
   cd mobile
   npm install
   ```

2. **Verificar la Dirección IP del Backend**:
   Abre el archivo [`mobile/src/services/api.ts`](file:///c:/Users/jherr/Herd/proyecto_arquitectura_empresarial_2026/mobile/src/services/api.ts) y confirma que la variable `API_BASE_URL` apunte a la IP de tu computadora en la red Wi-Fi (ejemplo `http://192.168.1.20:8000/api`).

3. **Iniciar el servidor de Expo**:
   ```bash
   npm start
   ```

4. **Probar en tu dispositivo**:
   - **En Teléfono Físico**: Abre la aplicación **Expo Go** en tu celular y escanea el código QR que se muestra en la terminal.
   - **En la Web (Simulador)**: Presiona la tecla **`w`** en la terminal.
   - **Credenciales de Login Móvil**:
     - **Email**: `admin@puce.edu.ec`
     - **Contraseña**: `password123`

---

## 🧪 Pruebas de API y Documentación

- **Postman**: La colección de endpoints se encuentra en la raíz como [`PUCE_Empleado_API.postman_collection.json`](file:///c:/Users/jherr/Herd/proyecto_arquitectura_empresarial_2026/PUCE_Empleado_API.postman_collection.json).
- **Documentación API**: Revisa [`API_DOCUMENTACION.md`](file:///c:/Users/jherr/Herd/proyecto_arquitectura_empresarial_2026/API_DOCUMENTACION.md) para consultar los esquemas de respuestas e instrucciones detalladas.
