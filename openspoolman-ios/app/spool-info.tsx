import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SpoolManAPI, Spool } from '../services/api';

export default function SpoolInfoScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spool, setSpool] = useState<Spool | null>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    loadSpoolData();
  }, [params.tagId]);

  const loadSpoolData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tagId = params.tagId as string;
      const spoolData = await SpoolManAPI.getSpoolByTagId(tagId);
      
      if (!spoolData) {
        setError('Không tìm thấy spool với tag này');
      } else {
        setSpool(spoolData);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin spool...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.tagId}>Tag ID: {params.tagId}</Text>
      </View>
    );
  }

  if (!spool) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy dữ liệu</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>🧵</Text>
          <Text style={styles.title}>Thông tin Spool</Text>
          
          <View style={styles.infoSection}>
            <InfoRow label="Spool ID" value={spool.id.toString()} />
            <InfoRow 
              label="Filament" 
              value={`${spool.filament.vendor.name} - ${spool.filament.name}`} 
            />
            <InfoRow label="Chất liệu" value={spool.filament.material} />
            <View style={styles.infoRow}>
              <Text style={styles.label}>Màu sắc:</Text>
              <View style={styles.colorRow}>
                <View 
                  style={[styles.colorBox, { backgroundColor: spool.filament.color_hex }]} 
                />
                <Text style={styles.value}>{spool.filament.color_hex}</Text>
              </View>
            </View>
            <InfoRow 
              label="Khối lượng còn lại" 
              value={`${spool.remaining_weight}g`} 
            />
            {spool.extra?.active_tray && (
              <InfoRow label="AMS Tray" value={spool.extra.active_tray} />
            )}
          </View>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              💡 Dữ liệu được tải từ Spoolman API
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  note: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
  tagId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
