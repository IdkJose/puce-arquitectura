import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    fecha_ingreso: string;
    salario: string;
}

export default function Dashboard() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalInfo, setModalInfo] = useState<{ title: string; content: React.ReactNode } | null>(null);

    const [formCrear, setFormCrear] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        fecha_ingreso: '',
        salario: '',
    });

    const cargarEmpleados = () => {
        setLoading(true);
        fetch('/api/empleados')
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    setEmpleados(data.data);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const handleCrearEmpleado = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('/api/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formCrear),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    setFormCrear({ nombre: '', apellido: '', fecha_nacimiento: '', fecha_ingreso: '', salario: '' });
                    cargarEmpleados();
                } else {
                    alert(data.message || 'Error al crear empleado');
                }
            });
    };

    const handleCalcularEdad = (emp: Empleado) => {
        fetch(`/api/empleados/${emp.id}/edad`)
            .then((res) => res.json())
            .then((data) => {
                setModalInfo({
                    title: `🎂 Edad de ${emp.nombre} ${emp.apellido}`,
                    content: (
                        <div className="space-y-3">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Fecha de Nacimiento</span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{data.fecha_nacimiento}</span>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                <span className="text-xs text-blue-600 dark:text-blue-400 block font-semibold uppercase tracking-wider">Edad Calculada</span>
                                <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">{data.edad} años</span>
                            </div>
                        </div>
                    ),
                });
            });
    };

    const handleCalcularAntiguedad = (emp: Empleado) => {
        fetch(`/api/empleados/${emp.id}/antiguedad`)
            .then((res) => res.json())
            .then((data) => {
                const a = data.antiguedad;
                setModalInfo({
                    title: `⏱️ Antigüedad de ${emp.nombre} ${emp.apellido}`,
                    content: (
                        <div className="space-y-3">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Fecha de Ingreso</span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{emp.fecha_ingreso}</span>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                                <span className="text-xs text-amber-700 dark:text-amber-400 block font-semibold uppercase tracking-wider">Tiempo en la empresa</span>
                                <span className="text-xl font-bold text-amber-800 dark:text-amber-200">{a.texto}</span>
                            </div>
                        </div>
                    ),
                });
            });
    };

    const handleCalcularPrestaciones = (emp: Empleado) => {
        fetch(`/api/empleados/${emp.id}/prestaciones`)
            .then((res) => res.json())
            .then((data) => {
                const p = data.prestaciones;
                setModalInfo({
                    title: `📊 Décimos y Prestaciones: ${emp.nombre} ${emp.apellido}`,
                    content: (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                                    <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-medium">Décimo Tercero (Navideño)</span>
                                    <span className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">${p.decimo_tercer_sueldo.toFixed(2)}</span>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                                    <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-medium">Décimo Cuarto (Escolar)</span>
                                    <span className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">${p.decimo_cuarto_sueldo.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">ℹ️ {p.detalle}</p>
                            </div>
                        </div>
                    ),
                });
            });
    };

    const handleAumentarSalario = (emp: Empleado) => {
        const nuevoSalarioStr = prompt(`Ingrese el nuevo salario para ${emp.nombre} ${emp.apellido}:`, emp.salario);
        if (!nuevoSalarioStr) return;

        fetch(`/api/empleados/${emp.id}/salario`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salario: parseFloat(nuevoSalarioStr) }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    cargarEmpleados();
                }
            });
    };

    const handleEliminar = (id: number) => {
        if (!confirm('¿Desea eliminar este registro de empleado?')) return;

        fetch(`/api/empleados/${id}`, { method: 'DELETE' })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    cargarEmpleados();
                }
            });
    };

    return (
        <>
            <Head title="Gestión de Empleados - PUCE" />
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-sans p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <header className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50">
                                PUCE Arquitectura 2026
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                                Sistema de Gestion de Empleados
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                                Calculos de Decimo Tercero, Decimo Cuarto y Antiguedad Laboral
                            </p>
                        </div>
                    </header>

                    {/* Formulario de Registro */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700/60">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            Registrar Nuevo Empleado
                        </h2>
                        <form onSubmit={handleCrearEmpleado} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Juan"
                                    value={formCrear.nombre}
                                    onChange={(e) => setFormCrear({ ...formCrear, nombre: e.target.value })}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Pérez"
                                    value={formCrear.apellido}
                                    onChange={(e) => setFormCrear({ ...formCrear, apellido: e.target.value })}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">F. Nacimiento</label>
                                <input
                                    type="date"
                                    value={formCrear.fecha_nacimiento}
                                    onChange={(e) => setFormCrear({ ...formCrear, fecha_nacimiento: e.target.value })}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">F. Ingreso</label>
                                <input
                                    type="date"
                                    value={formCrear.fecha_ingreso}
                                    onChange={(e) => setFormCrear({ ...formCrear, fecha_ingreso: e.target.value })}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Salario ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="450.00"
                                    value={formCrear.salario}
                                    onChange={(e) => setFormCrear({ ...formCrear, salario: e.target.value })}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div className="sm:col-span-2 lg:col-span-5 flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition shadow-sm"
                                >
                                    Guardar Empleado
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tabla de Empleados */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700/60 overflow-hidden">
                        <div className="p-5 border-b border-gray-200 dark:border-slate-700/60 flex justify-between items-center">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Nomina de Empleados</h2>
                            <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                                Total: {empleados.length}
                            </span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500 dark:text-slate-400 text-sm">Cargando datos de empleados...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 uppercase text-[11px] tracking-wider font-semibold border-b border-gray-200 dark:border-slate-700/60">
                                        <tr>
                                            <th className="px-5 py-3.5">Empleado</th>
                                            <th className="px-5 py-3.5">Fecha Ingreso</th>
                                            <th className="px-5 py-3.5">Salario Base</th>
                                            <th className="px-5 py-3.5 text-right">Acciones de Calculo API</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700/60">
                                        {empleados.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition">
                                                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                                    {emp.nombre} {emp.apellido}
                                                </td>
                                                <td className="px-5 py-4 text-gray-600 dark:text-slate-300 font-medium">
                                                    {emp.fecha_ingreso}
                                                </td>
                                                <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400 font-bold">
                                                    ${parseFloat(emp.salario).toFixed(2)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleCalcularEdad(emp)}
                                                            className="bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-xs px-2.5 py-1.5 rounded-md font-semibold transition"
                                                        >
                                                            🎂 Edad
                                                        </button>
                                                        <button
                                                            onClick={() => handleCalcularAntiguedad(emp)}
                                                            className="bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs px-2.5 py-1.5 rounded-md font-semibold transition"
                                                        >
                                                            ⏱️ Antiguedad
                                                        </button>
                                                        <button
                                                            onClick={() => handleCalcularPrestaciones(emp)}
                                                            className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs px-2.5 py-1.5 rounded-md font-semibold transition"
                                                        >
                                                            📊 Decimos
                                                        </button>
                                                        <button
                                                            onClick={() => handleAumentarSalario(emp)}
                                                            className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-xs px-2.5 py-1.5 rounded-md font-semibold transition"
                                                        >
                                                            ✏️ Salario
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminar(emp.id)}
                                                            className="bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs px-2.5 py-1.5 rounded-md font-semibold transition"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Modal de información de la API */}
                    {modalInfo && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">
                                    {modalInfo.title}
                                </h3>
                                <div>{modalInfo.content}</div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => setModalInfo(null)}
                                        className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 text-sm font-semibold px-4 py-2 rounded-lg transition"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
