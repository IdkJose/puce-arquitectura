# 📱 Cliente Móvil React Native (Expo) - Proyecto Integrador PUCE

Esta aplicación móvil desarrollada en **React Native con Expo y TypeScript** consume el backend en Laravel 11 utilizando autenticación segura mediante **JWT (JSON Web Token)**.

---

## 🚀 Paso 1: Crear el proyecto con Expo

Si deseas crear la estructura inicial del proyecto móvil Expo en tu computadora, ejecuta en tu terminal:

```bash
npx create-expo-app@latest mobile --template blank-typescript
```

---

## 📦 Paso 2: Instalación de dependencias

Ingresa a la carpeta `mobile` e instala los paquetes necesarios para la persistencia del Token JWT:

```bash
cd mobile
npm install @react-native-async-storage/async-storage
```

---

## 📱 Paso 3: Estructura del código cliente

El código funcional completo ha sido generado en:
* 🌐 [`mobile/src/services/api.ts`](file:///c:/Users/jherr/OneDrive/Documentos/Arquitectura_empresarial_integrador/puce-arquitectura/mobile/src/services/api.ts): Cliente HTTP con consumo JWT de Laravel.
* 🔑 [`mobile/src/screens/LoginScreen.tsx`](file:///c:/Users/jherr/OneDrive/Documentos/Arquitectura_empresarial_integrador/puce-arquitectura/mobile/src/screens/LoginScreen.tsx): Pantalla de login de administrador.
* 📊 [`mobile/src/screens/HomeScreen.tsx`](file:///c:/Users/jherr/OneDrive/Documentos/Arquitectura_empresarial_integrador/puce-arquitectura/mobile/src/screens/HomeScreen.tsx): Lista de empleados y modal de cálculo de décimos.

---

## 🏃‍♂️ Paso 4: Ejecutar la Aplicación

Para iniciar el servidor de desarrollo de Expo y probar en tu teléfono (con la app **Expo Go**) o en un emulador:

```bash
npm start
```

* **Credenciales de Prueba**:
  * **Email**: `admin@puce.edu.ec`
  * **Password**: `password123`
