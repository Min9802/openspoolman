import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { router } from 'expo-router';

export default function ReadNFCScreen() {
  const [isNFCSupported, setIsNFCSupported] = useState<boolean | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    initNFC();
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

  const readNFCTag = async () => {
    if (!isNFCSupported) {
      Alert.alert('Lỗi', 'NFC không được hỗ trợ trên thiết bị này.');
      return;
    }

    try {
      setIsReading(true);

      Alert.alert(
        'Sẵn sàng đọc',
        'Chạm iPhone vào thẻ NFC để đọc thông tin spool.',
        [
          {
            text: 'Hủy',
            style: 'cancel',
            onPress: () => setIsReading(false),
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                await NfcManager.requestTechnology(NfcTech.Ndef);

                const tag = await NfcManager.ndefHandler.getNdefMessage();
                
                if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
                  const record = tag.ndefMessage[0];
                  
                  const payload = new Uint8Array(record.payload);
                  const text = Ndef.text.decodePayload(payload);
                  const tagId = text;
                  
                  setIsReading(false);
                  NfcManager.cancelTechnologyRequest();
                  
                  Alert.alert(
                    'Đọc thành công! ✅',
                    `Tag ID: ${tagId}`,
                    [
                      {
                        text: 'Xem thông tin',
                        onPress: () => {
                          router.push({
                            pathname: '/spool-info',
                            params: { tagId }
                          });
                        },
                      },
                      {
                        text: 'Đọc tiếp',
                        onPress: () => readNFCTag(),
                      },
                      {
                        text: 'Đóng',
                        style: 'cancel',
                      },
                    ]
                  );
                } else {
                  setIsReading(false);
                  NfcManager.cancelTechnologyRequest();
                  Alert.alert('Lỗi', 'Không tìm thấy dữ liệu trên NFC tag.');
                }
              } catch (ex) {
                console.error('Error reading NFC:', ex);
                setIsReading(false);
                NfcManager.cancelTechnologyRequest();
                Alert.alert('Lỗi', 'Không thể đọc NFC tag: ' + ex);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in readNFCTag:', error);
      setIsReading(false);
      Alert.alert('Lỗi', 'Lỗi khi chuẩn bị đọc NFC');
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📖</Text>
      <Text style={styles.title}>Đọc NFC Tag</Text>
      <Text style={styles.subtitle}>
        Chạm iPhone vào thẻ NFC để đọc thông tin spool
      </Text>

      <TouchableOpacity
        style={[styles.button, isReading && styles.buttonDisabled]}
        onPress={readNFCTag}
        disabled={isReading}
      >
        {isReading ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.buttonText}>Đang đọc...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Bắt đầu đọc NFC</Text>
        )}
      </TouchableOpacity>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>📋 Hướng dẫn:</Text>
        <Text style={styles.instructionText}>1. Nhấn nút "Bắt đầu đọc NFC"</Text>
        <Text style={styles.instructionText}>2. Chạm iPhone vào thẻ NFC</Text>
        <Text style={styles.instructionText}>3. Xem thông tin spool được hiển thị</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 64,
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
    textAlign: 'center',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  instructions: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
