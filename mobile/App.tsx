import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { apiService } from './src/services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await apiService.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <HomeScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
});
