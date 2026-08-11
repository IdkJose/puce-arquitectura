import AsyncStorage from '@react-native-async-storage/async-storage';

// Nota: Reemplaza IP_DE_TU_PC con tu IP local (ejemplo: 192.168.1.50) si pruebas en un celular real o emulador.
const API_BASE_URL = 'http://10.0.2.2:8000/api'; // 10.0.2.2 es la IP especial de localhost para el emulador de Android

export interface LoginResponse {
  status: string;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  salario: string;
}

export interface PrestacionesResponse {
  status: string;
  empleado: string;
  salario_base: string;
  prestaciones: {
    decimo_tercer_sueldo: number;
    decimo_cuarto_sueldo: number;
    dias_calculados: number;
    detalle: string;
  };
}

export const apiService = {
  // 1. Iniciar sesión y guardar Token JWT
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok && data.access_token) {
      await AsyncStorage.setItem('jwt_token', data.access_token);
      return data;
    }
    throw new Error(data.message || 'Error al iniciar sesión');
  },

  // 2. Obtener Token almacenado
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('jwt_token');
  },

  // 3. Cerrar Sesión
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('jwt_token');
  },

  // 4. Obtener Lista de Empleados
  async getEmpleados(): Promise<Empleado[]> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Error al cargar empleados');
  },

  // 5. Obtener Prestaciones (Décimos) de un Empleado
  async getPrestaciones(id: number): Promise<PrestacionesResponse> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados/${id}/prestaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return data;
    }
    throw new Error(data.message || 'Error al calcular prestaciones');
  }
};
