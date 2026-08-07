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