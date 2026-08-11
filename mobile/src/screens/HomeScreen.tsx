import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { apiService, Empleado } from '../services/api';

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [crearVisible, setCrearVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [salario, setSalario] = useState('');

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmpleados();
      setEmpleados(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleCrear = async () => {
    try {
      await apiService.crearEmpleado({
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento,
        fecha_ingreso: fechaIngreso,
        salario,
      });
      setCrearVisible(false);
      setNombre('');
      setApellido('');
      setFechaNacimiento('');
      setFechaIngreso('');
      setSalario('');
      fetchEmpleados();
      Alert.alert('Éxito', 'Empleado registrado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEdad = async (emp: Empleado) => {
    try {
      const data = await apiService.getEdad(emp.id);
      setModalTitle(`🎂 Edad de ${emp.nombre}`);
      setModalBody(
        <View>
          <Text style={styles.modalLabel}>Fecha de Nacimiento:</Text>
          <Text style={styles.modalValueText}>{data.fecha_nacimiento}</Text>
          <View style={styles.badgeBoxBlue}>
            <Text style={styles.badgeLabelBlue}>EDAD CALCULADA</Text>
            <Text style={styles.badgeValueBlue}>{data.edad} años</Text>
          </View>
        </View>
      );
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAntiguedad = async (emp: Empleado) => {
    try {
      const data = await apiService.getAntiguedad(emp.id);
      setModalTitle(`⏱️ Antigüedad de ${emp.nombre}`);
      setModalBody(
        <View>
          <Text style={styles.modalLabel}>Fecha de Ingreso:</Text>
          <Text style={styles.modalValueText}>{emp.fecha_ingreso}</Text>
          <View style={styles.badgeBoxAmber}>
            <Text style={styles.badgeLabelAmber}>TIEMPO EN LA EMPRESA</Text>
            <Text style={styles.badgeValueAmber}>{data.texto}</Text>
          </View>
        </View>
      );
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePrestaciones = async (emp: Empleado) => {
    try {
      const data = await apiService.getPrestaciones(emp.id);
      const p = data.prestaciones;
      setModalTitle(`📊 Décimos de ${emp.nombre}`);
      setModalBody(
        <View>
          <View style={styles.gridBox}>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatLabel}>Décimo Tercero</Text>
              <Text style={styles.cardStatValue}>${p.decimo_tercer_sueldo.toFixed(2)}</Text>
            </View>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatLabel}>Décimo Cuarto</Text>
              <Text style={styles.cardStatValue}>${p.decimo_cuarto_sueldo.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.detailText}>ℹ️ {p.detalle}</Text>
        </View>
      );
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAumentarSalario = (emp: Empleado) => {
    Alert.prompt(
      'Actualizar Salario',
      `Ingrese el nuevo salario para ${emp.nombre}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: async (val) => {
            if (!val) return;
            try {
              await apiService.updateSalario(emp.id, parseFloat(val));
              fetchEmpleados();
              Alert.alert('Éxito', 'Salario actualizado');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
      'plain-text',
      emp.salario
    );
  };

  const handleEliminar = (id: number) => {
    Alert.alert('Eliminar', '¿Desea eliminar este registro de empleado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deleteEmpleado(id);
            fetchEmpleados();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Empleado }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.cardSalary}>${parseFloat(item.salario).toFixed(2)}</Text>
      </View>
      
      <Text style={styles.cardSub}>F. Ingreso: {item.fecha_ingreso}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnSky} onPress={() => handleEdad(item)}>
          <Text style={styles.btnTextSky}>🎂 Edad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAmber} onPress={() => handleAntiguedad(item)}>
          <Text style={styles.btnTextAmber}>⏱️ Antigüedad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEmerald} onPress={() => handlePrestaciones(item)}>
          <Text style={styles.btnTextEmerald}>📊 Décimos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGray} onPress={() => handleAumentarSalario(item)}>
          <Text style={styles.btnTextGray}>✏️ Salario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRose} onPress={() => handleEliminar(item.id)}>
          <Text style={styles.btnTextRose}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>PUCE ARQUITECTURA 2026</Text>
          <Text style={styles.headerTitle}>Gestión de Empleados</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setCrearVisible(true)}>
            <Text style={styles.addBtnText}>+ Nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshing={loading}
          onRefresh={fetchEmpleados}
        />
      )}

      {/* Modal General de Respuestas API */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            {modalBody}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Formulario Crear Empleado */}
      <Modal animationType="slide" transparent visible={crearVisible} onRequestClose={() => setCrearVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Registrar Empleado</Text>

              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput placeholder="Ej. Juan" placeholderTextColor="#64748b" value={nombre} onChangeText={setNombre} style={styles.input} />

              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput placeholder="Ej. Pérez" placeholderTextColor="#64748b" value={apellido} onChangeText={setApellido} style={styles.input} />

              <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
              <TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#64748b" value={fechaNacimiento} onChangeText={setFechaNacimiento} style={styles.input} />

              <Text style={styles.inputLabel}>Fecha de Ingreso</Text>
              <TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#64748b" value={fechaIngreso} onChangeText={setFechaIngreso} style={styles.input} />

              <Text style={styles.inputLabel}>Salario Base ($)</Text>
              <TextInput placeholder="450.00" placeholderTextColor="#64748b" value={salario} onChangeText={setSalario} keyboardType="numeric" style={styles.input} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleCrear}>
                <Text style={styles.saveBtnText}>Guardar Empleado</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setCrearVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155' },
  headerSubtitle: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.8 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  addBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  logoutButton: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  logoutText: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  cardSalary: { fontSize: 16, fontWeight: 'bold', color: '#34d399' },
  cardSub: { color: '#94a3b8', fontSize: 12, marginBottom: 14 },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  btnSky: { backgroundColor: '#0369a1', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  btnTextSky: { color: '#e0f2fe', fontSize: 11, fontWeight: 'bold' },
  btnAmber: { backgroundColor: '#b45309', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  btnTextAmber: { color: '#fef3c7', fontSize: 11, fontWeight: 'bold' },
  btnEmerald: { backgroundColor: '#047857', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  btnTextEmerald: { color: '#d1fae5', fontSize: 11, fontWeight: 'bold' },
  btnGray: { backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  btnTextGray: { color: '#e2e8f0', fontSize: 11, fontWeight: 'bold' },
  btnRose: { backgroundColor: '#be123c', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  btnTextRose: { color: '#ffe4e6', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 8 },
  modalLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  modalValueText: { color: '#f8fafc', fontSize: 14, marginTop: 2, marginBottom: 12 },
  badgeBoxBlue: { backgroundColor: '#0c4a6e', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#0284c7' },
  badgeLabelBlue: { color: '#7dd3fc', fontSize: 10, fontWeight: 'bold' },
  badgeValueBlue: { color: '#ffffff', fontSize: 24, fontWeight: 'extrabold', marginTop: 2 },
  badgeBoxAmber: { backgroundColor: '#451a03', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d97706' },
  badgeLabelAmber: { color: '#fcd34d', fontSize: 10, fontWeight: 'bold' },
  badgeValueAmber: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  gridBox: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cardStat: { flex: 1, backgroundColor: '#064e3b', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#059669' },
  cardStatLabel: { color: '#6ee7b7', fontSize: 11, fontWeight: 'bold' },
  cardStatValue: { color: '#ffffff', fontSize: 20, fontWeight: 'extrabold', marginTop: 2 },
  detailText: { color: '#94a3b8', fontSize: 11, fontStyle: 'italic', marginTop: 12 },
  closeBtn: { marginTop: 18, backgroundColor: '#334155', padding: 11, borderRadius: 8, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold' },
  inputLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  input: { backgroundColor: '#0f172a', color: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  saveBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: 'transparent', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  cancelBtnText: { color: '#94a3b8', fontWeight: 'bold' },
});
