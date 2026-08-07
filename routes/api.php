<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmpleadoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider or bootstrap/app.php
| and will be assigned the "api" middleware group. Make something great!
|
*/

// Rutas Públicas de Autenticación
Route::post('/auth/login', [AuthController::class, 'login']);

// Rutas Protegidas por JWT (Auth Middleware)
Route::middleware('auth:api')->group(function () {
    
    // Perfil del Administrador
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Endpoints del Caso Empleados PUCE
    Route::get('/empleados', [EmpleadoController::class, 'index']);                    // (2) Mostrar todos
    Route::post('/empleados', [EmpleadoController::class, 'store']);                   // (1) Guardar
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);                // (2) Mostrar uno
    Route::get('/empleados/{id}/edad', [EmpleadoController::class, 'calcularEdad']);       // (3) Calcular Edad
    Route::get('/empleados/{id}/antiguedad', [EmpleadoController::class, 'calcularAntiguedad']); // (4) Calcular Antigüedad
    Route::get('/empleados/{id}/prestaciones', [EmpleadoController::class, 'calcularPrestaciones']); // (5) Calcular Prestaciones
    Route::patch('/empleados/{id}/salario', [EmpleadoController::class, 'updateSalario']); // (6) Aumentar salario
    Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);            // (7) Eliminar
});
