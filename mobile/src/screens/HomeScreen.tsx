import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { apiService, Empleado, PrestacionesResponse } from '../services/api';

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestacion, setSelectedPrestacion] = useState<PrestacionesResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [calculatingId, setCalculatingId] = useState<number | null>(null);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmpleados();
      setEmpleados(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleVerPrestaciones = async (id: number) => {
    setCalculatingId(id);
    try {
      const result = await apiService.getPrestaciones(id);
      setSelectedPrestacion(result);
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al calcular prestaciones');
    } finally {
      setCalculatingId(null);
    }
  };

  const renderItem = ({ item }: { item: Empleado }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.cardSalary}>${parseFloat(item.salario).toFixed(2)}</Text>
      </View>
      
      <Text style={styles.cardSub}>Ingreso: {item.fecha_ingreso}</Text>
      <Text style={styles.cardSub}>Nacimiento: {item.fecha_nacimiento}</Text>

      <TouchableOpacity
        style={styles.calcButton}
        onPress={() => handleVerPrestaciones(item.id)}
        disabled={calculatingId === item.id}
      >
        {calculatingId === item.id ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.calcButtonText}>📊 Calcular Décimos (13ro y 14to)</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Empleados PUCE</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#1e3a8a" />
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchEmpleados}
        />
      )}

      {/* Modal de Prestaciones Laborales */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cálculo de Prestaciones PUCE</Text>
            {selectedPrestacion && (
              <>
                <Text style={styles.modalEmpleado}>Empleado: {selectedPrestacion.empleado}</Text>
                <Text style={styles.modalSub}>Salario Base: ${selectedPrestacion.salario_base}</Text>

                <View style={styles.benefitBox}>
                  <Text style={styles.benefitLabel}>🎁 Décimo Tercer Sueldo (Navideño):</Text>
                  <Text style={styles.benefitValue}>
                    ${selectedPrestacion.prestaciones.decimo_tercer_sueldo.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.benefitBox}>
                  <Text style={styles.benefitLabel}>🎒 Décimo Cuarto Sueldo (Escolar):</Text>
                  <Text style={styles.benefitValue}>
                    ${selectedPrestacion.prestaciones.decimo_cuarto_sueldo.toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.detailText}>
                  ℹ️ {selectedPrestacion.prestaciones.detalle}
                </Text>
              </>
            )}

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardSalary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  cardSub: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 2,
  },
  calcButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  calcButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  modalEmpleado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  modalSub: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  benefitBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  benefitLabel: {
    fontSize: 14,
    color: '#475569',
  },
  benefitValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#475569',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
