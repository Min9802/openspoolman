import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { ConfigService } from '../services/config';

export default function HomeScreen() {
  const [baseUrl, setBaseUrl] = useState('https://spoolman.local');
  const [spoolmanUrl, setSpoolmanUrl] = useState('http://localhost:8000');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await ConfigService.getConfig();
    setBaseUrl(config.baseUrl);
    setSpoolmanUrl(config.spoolmanUrl);
    setLoading(false);
  };

  const saveConfig = async () => {
    await ConfigService.saveConfig({ baseUrl, spoolmanUrl });
    Alert.alert('Thành công', 'Đã lưu cấu hình');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧵 OpenSpoolMan iOS</Text>
      <Text style={styles.subtitle}>NFC Tag Manager for Bambu Lab</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>OpenSpoolMan Web URL:</Text>
        <TextInput
          style={styles.input}
          value={baseUrl}
          onChangeText={setBaseUrl}
          placeholder="https://spoolman.local"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Spoolman API URL:</Text>
        <TextInput
          style={styles.input}
          value={spoolmanUrl}
          onChangeText={setSpoolmanUrl}
          placeholder="http://localhost:8000"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, styles.saveButton]} 
        onPress={saveConfig}
      >
        <Text style={styles.buttonText}>💾 Lưu cấu hình</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Link href="/write" asChild>
          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.buttonText}>✍️ Write NFC Tag</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/read" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.buttonText}>📖 Read NFC Tag</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>📱 iOS NFC Support</Text>
        <Text style={styles.infoSubtext}>Write filament spool info to NFC tags</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#5AC8FA',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
