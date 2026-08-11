# 💻 Código Fuente Completo del Proyecto Backend: Empleados PUCE

Este archivo contiene el código fuente real del sistema de gestión de empleados y cálculo de prestaciones laborales desarrollado en Laravel 11.

---

## 1. Capa de Servicios: Lógica de Negocio Laboral

### `app/Services/CalculosLaboralesService.php`
```php
<?php

namespace App\Services;

use Carbon\Carbon;
use Carbon\CarbonInterface;

class CalculosLaboralesService
{
    public function calcularEdad(CarbonInterface $fechaNacimiento): int
    {
        return $fechaNacimiento->age;
    }

    public function calcularAntiguedad(CarbonInterface $fechaIngreso): array
    {
        $hoy = Carbon::now();
        $diferencia = $fechaIngreso->diff($hoy);

        return [
            'anios'  => $diferencia->y,
            'meses'  => $diferencia->m,
            'dias'   => $diferencia->d,
            'texto'  => "{$diferencia->y} años, {$diferencia->m} meses y {$diferencia->d} días"
        ];
    }

    public function calcularPrestaciones(float $salario, CarbonInterface $fechaIngreso): array
    {
        $hoy = Carbon::now();
        $diasTrabajadosTotal = $fechaIngreso->diffInDays($hoy);

        $sbu = 450.00; // Salario Básico Unificado Ecuador

        if ($diasTrabajadosTotal >= 365) {
            $decimoTercero = $salario;
            $decimoCuarto = $sbu;
        } else {
            $diasLaborados = min($diasTrabajadosTotal, 360);
            
            $decimoTercero = ($salario / 360) * $diasLaborados;
            $decimoCuarto = ($sbu / 360) * $diasLaborados;
        }

        return [
            'decimo_tercer_sueldo' => round($decimoTercero, 2),
            'decimo_cuarto_sueldo' => round($decimoCuarto, 2),
            'dias_calculados' => (int) $diasTrabajadosTotal,
            'detalle' => $diasTrabajadosTotal >= 365 
                ? 'Valores completos (más de 1 año de antigüedad)' 
                : 'Valores proporcionales a los días laborados (' . (int) $diasTrabajadosTotal . ' días)'
        ];
    }
}
```

---

## 2. Controladores de la API REST

### `app/Http/Controllers/Api/EmpleadoController.php`
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Services\CalculosLaboralesService;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    protected $calculosService;

    public function __construct(CalculosLaboralesService $calculosService)
    {
        $this->calculosService = $calculosService;
    }

    public function index()
    {
        $empleados = Empleado::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $empleados
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date|before:today',
            'fecha_ingreso' => 'required|date|before_or_equal:today',
            'salario' => 'required|numeric|min:0',
        ]);

        $empleado = Empleado::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Empleado registrado con éxito',
            'data' => $empleado
        ], 201);
    }

    public function show($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empleado no encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $empleado
        ]);
    }

    public function calcularEdad($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['status' => 'error', 'message' => 'Empleado no encontrado'], 404);
        }

        $edad = $this->calculosService->calcularEdad($empleado->fecha_nacimiento);

        return response()->json([
            'status' => 'success',
            'empleado' => "{$empleado->nombre} {$empleado->apellido}",
            'fecha_nacimiento' => $empleado->fecha_nacimiento->format('Y-m-d'),
            'edad' => $edad
        ]);
    }

    public function calcularAntiguedad($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['status' => 'error', 'message' => 'Empleado no encontrado'], 404);
        }

        $antiguedad = $this->calculosService->calcularAntiguedad($empleado->fecha_ingreso);

        return response()->json([
            'status' => 'success',
            'empleado' => "{$empleado->nombre} {$empleado->apellido}",
            'fecha_ingreso' => $empleado->fecha_ingreso->format('Y-m-d'),
            'antiguedad' => $antiguedad
        ]);
    }

    public function calcularPrestaciones($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['status' => 'error', 'message' => 'Empleado no encontrado'], 404);
        }

        $prestaciones = $this->calculosService->calcularPrestaciones(
            (float) $empleado->salario,
            $empleado->fecha_ingreso
        );

        return response()->json([
            'status' => 'success',
            'empleado' => "{$empleado->nombre} {$empleado->apellido}",
            'salario_base' => $empleado->salario,
            'prestaciones' => $prestaciones
        ]);
    }

    public function updateSalario(Request $request, $id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['status' => 'error', 'message' => 'Empleado no encontrado'], 404);
        }

        $validated = $request->validate([
            'salario' => 'required|numeric|min:0',
        ]);

        $empleado->update([
            'salario' => $validated['salario']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Salario actualizado con éxito',
            'data' => $empleado
        ]);
    }

    public function destroy($id)
    {
        $empleado = Empleado::find($id);

        if (!$empleado) {
            return response()->json(['status' => 'error', 'message' => 'Empleado no encontrado'], 404);
        }

        $empleado->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Empleado eliminado correctamente'
        ]);
    }
}
```

---

## 3. Modelos Eloquent

### `app/Models/Empleado.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
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
}
```

---

## 4. Enrutador de la API

### `routes/api.php`
```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmpleadoController;
use Illuminate\Support\Facades\Route;

// Rutas públicas de autenticación JWT
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Rutas protegidas por JWT Middleware
Route::middleware('auth:api')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);
    
    // CRUD Empleados y Cálculos Laborales
    Route::get('empleados', [EmpleadoController::class, 'index']);
    Route::post('empleados', [EmpleadoController::class, 'store']);
    Route::get('empleados/{id}', [EmpleadoController::class, 'show']);
    Route::get('empleados/{id}/edad', [EmpleadoController::class, 'calcularEdad']);
    Route::get('empleados/{id}/antiguedad', [EmpleadoController::class, 'calcularAntiguedad']);
    Route::get('empleados/{id}/prestaciones', [EmpleadoController::class, 'calcularPrestaciones']);
    Route::patch('empleados/{id}/salario', [EmpleadoController::class, 'updateSalario']);
    Route::delete('empleados/{id}', [EmpleadoController::class, 'destroy']);
});
```
