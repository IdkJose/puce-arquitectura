import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.20:8000/api';

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

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('jwt_token');
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('jwt_token');
  },

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

  async crearEmpleado(empleado: Omit<Empleado, 'id'>): Promise<Empleado> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado),
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Error al crear empleado');
  },

  async getEdad(id: number): Promise<{ edad: number; fecha_nacimiento: string }> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados/${id}/edad`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return { edad: data.edad, fecha_nacimiento: data.fecha_nacimiento };
    }
    throw new Error(data.message || 'Error al calcular edad');
  },

  async getAntiguedad(id: number): Promise<any> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados/${id}/antiguedad`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return data.antiguedad;
    }
    throw new Error(data.message || 'Error al calcular antigüedad');
  },

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
  },

  async updateSalario(id: number, nuevoSalario: number): Promise<Empleado> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados/${id}/salario`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ salario: nuevoSalario }),
    });

    const data = await response.json();
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Error al actualizar salario');
  },

  async deleteEmpleado(id: number): Promise<void> {
    const token = await this.getToken();
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'Error al eliminar empleado');
    }
  }
};
