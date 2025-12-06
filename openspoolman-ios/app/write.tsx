import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { router } from 'expo-router';
import { SpoolManAPI, Spool } from '../services/api';

export default function WriteNFCScreen() {
  const [isNFCSupported, setIsNFCSupported] = useState<boolean | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [spools, setSpools] = useState<Spool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initNFC();
    loadSpools();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const initNFC = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsNFCSupported(supported);
      
      if (supported) {
        await NfcManager.start();
      } else {
        Alert.alert('NFC không được hỗ trợ', 'Thiết bị này không hỗ trợ NFC.');
      }
    } catch (error) {
      console.error('Error init NFC:', error);
      setIsNFCSupported(false);
    }
  };

  const loadSpools = async () => {
    try {
      const data = await SpoolManAPI.getSpools();
      setSpools(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách spools');
    } finally {
      setLoading(false);
    }
  };

  const writeNFCTag = async (spoolId: number) => {
    if (!isNFCSupported) {
      Alert.alert('Lỗi', 'NFC không được hỗ trợ trên thiết bị này.');
      return;
    }

    try {
      setIsWriting(true);

      Alert.alert(
        'Sẵn sàng ghi',
        'Chạm iPhone vào thẻ NFC để ghi thông tin spool.',
        [
          {
            text: 'Hủy',
            style: 'cancel',
            onPress: () => setIsWriting(false),
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                await NfcManager.requestTechnology(NfcTech.Ndef);

                const tagId = generateUUID();
                
                const bytes = Ndef.encodeMessage([
                  Ndef.textRecord(tagId),
                ]);

                await NfcManager.ndefHandler.writeNdefMessage(bytes);

                await SpoolManAPI.updateSpoolTag(spoolId, tagId);

                Alert.alert('Thành công', 'Đã ghi NFC tag thành công!');
                setIsWriting(false);
                
              } catch (ex) {
                console.error('Error writing NFC:', ex);
                Alert.alert('Lỗi', 'Không thể ghi NFC tag: ' + ex);
                setIsWriting(false);
              } finally {
                NfcManager.cancelTechnologyRequest();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in writeNFCTag:', error);
      Alert.alert('Lỗi', 'Lỗi khi chuẩn bị ghi NFC');
      setIsWriting(false);
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  if (isNFCSupported === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Đang kiểm tra NFC...</Text>
      </View>
    );
  }

  if (!isNFCSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>NFC Không được hỗ trợ</Text>
        <Text style={styles.subtitle}>Thiết bị này không hỗ trợ NFC</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Đang tải danh sách spools...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.icon}>✍️</Text>
        <Text style={styles.title}>Ghi NFC Tag</Text>
        <Text style={styles.subtitle}>Chọn spool để ghi vào NFC tag</Text>

        <View style={styles.spoolList}>
          {spools.map((spool) => (
            <TouchableOpacity
              key={spool.id}
              style={styles.spoolItem}
              onPress={() => writeNFCTag(spool.id)}
              disabled={isWriting}
            >
              <View style={styles.spoolInfo}>
                <Text style={styles.spoolName}>
                  {spool.filament.vendor.name} - {spool.filament.name}
                </Text>
                <Text style={styles.spoolDetails}>
                  {spool.filament.material} • {spool.remaining_weight}g
                </Text>
              </View>
              <View
                style={[styles.colorIndicator, { backgroundColor: spool.filament.color_hex }]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {isWriting && (
          <View style={styles.writingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.writingText}>Chạm vào NFC tag...</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  icon: {
    fontSize: 64,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  spoolList: {
    width: '100%',
    marginTop: 20,
  },
  spoolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spoolInfo: {
    flex: 1,
  },
  spoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  spoolDetails: {
    fontSize: 14,
    color: '#666',
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  writingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
});
