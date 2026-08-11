import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="PUCE - Arquitectura Empresarial" />
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-3xl text-center space-y-6">
                    <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider">
                        Proyecto Integrador PUCE 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Sistema de Gestión de Empleados y Cálculos Laborales
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl">
                        Plataforma unificada en <strong className="text-slate-200">React & React Native</strong> para la consulta y cálculo automatizado de Décimo Tercer y Décimo Cuarto Sueldo.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link
                            href="/dashboard"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition"
                        >
                            Ir al Panel de Control (React Web)
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
