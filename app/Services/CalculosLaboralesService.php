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
            'anios' => $diferencia->y,
            'meses' => $diferencia->m,
            'dias' => $diferencia->d,
            'texto' => "{$diferencia->y} años, {$diferencia->m} meses y {$diferencia->d} días",
        ];
    }

    public function calcularPrestaciones(float $salario, CarbonInterface $fechaIngreso): array
    {
        $hoy = Carbon::now();
        $diasTrabajadosTotal = $fechaIngreso->diffInDays($hoy);

        $sbu = 450.00;

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
                : 'Valores proporcionales a los días laborados ('.(int) $diasTrabajadosTotal.' días)',
        ];
    }
}
