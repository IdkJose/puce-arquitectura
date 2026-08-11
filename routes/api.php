<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmpleadoController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    Route::get('/empleados', [EmpleadoController::class, 'index']);
    Route::post('/empleados', [EmpleadoController::class, 'store']);
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    Route::get('/empleados/{id}/edad', [EmpleadoController::class, 'calcularEdad']);
    Route::get('/empleados/{id}/antiguedad', [EmpleadoController::class, 'calcularAntiguedad']);
    Route::get('/empleados/{id}/prestaciones', [EmpleadoController::class, 'calcularPrestaciones']);
    Route::patch('/empleados/{id}/salario', [EmpleadoController::class, 'updateSalario']);
    Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);
});
