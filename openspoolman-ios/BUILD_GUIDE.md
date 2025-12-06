# Hướng dẫn Build và Cài đặt App iOS

## Đã hoàn thành

✅ **Tích hợp API thực:**
- Service layer với ConfigService và SpoolManAPI
- AsyncStorage để lưu cấu hình URL
- Axios để gọi Spoolman API
- Loại bỏ tất cả mock data

✅ **Màn hình đã cập nhật:**
- `index.tsx`: Thêm cấu hình 2 URL (Web + API)
- `spool-info.tsx`: Hiển thị dữ liệu thực từ API
- Hỗ trợ tiếng Việt

✅ **Dependencies đã cài:**
```json
"@react-native-async-storage/async-storage": "^1.24.0",
"axios": "^1.13.2",
"react-native-nfc-manager": "^3.14.0"
```

## Còn phải làm

❌ **Cập nhật NFC Manager:**
- File `write.tsx` và `read.tsx` vẫn dùng `expo-nfc` (không tồn tại)
- Cần chuyển sang `react-native-nfc-manager`

❌ **Build App:**
```bash
# 1. Đăng nhập EAS (miễn phí)
npx eas login

# 2. Configure project
npx eas build:configure

# 3. Build .ipa file
npx eas build --platform ios --profile preview
```

## Cách sử dụng App

### Bước 1: Cấu hình URL
Mở app → Nhập 2 URL:
- **OpenSpoolMan Web URL**: `https://spoolman.local` (hoặc IP máy chủ)
- **Spoolman API URL**: `http://localhost:8000` (hoặc IP:port)
- Nhấn **💾 Lưu cấu hình**

### Bước 2: Đọc NFC Tag
- Nhấn **📖 Read NFC Tag**
- Chạm iPhone vào tag NFC
- App sẽ gọi API: `GET /api/v1/spool` để tìm spool có `extra.tag` khớp
- Hiển thị: Spool ID, Filament, Chất liệu, Màu sắc, Khối lượng còn lại

### Bước 3: Ghi NFC Tag
- Nhấn **✍️ Write NFC Tag**
- Chọn Spool từ danh sách
- Chạm iPhone vào tag NFC để ghi

## API Endpoints được sử dụng

```typescript
// Lấy tất cả spools
GET ${spoolmanUrl}/api/v1/spool

// Lấy spool theo ID
GET ${spoolmanUrl}/api/v1/spool/${id}

// Cập nhật tag cho spool
PATCH ${spoolmanUrl}/api/v1/spool/${id}
Body: { extra: { tag: "uuid" } }

// Set active tray
PATCH ${spoolmanUrl}/api/v1/spool/${id}
Body: { extra: { active_tray: '{"ams":"1","tray":"2"}' } }
```

## Cài đặt trên iPhone

### Option 1: AltStore (Khuyên dùng)
- Tự động refresh mỗi 7 ngày
- Cài AltServer trên PC/Mac
- Kết nối iPhone qua WiFi
- Kéo thả .ipa vào AltStore

### Option 2: Sideloadly
- Cần refresh thủ công mỗi 7 ngày
- Tải Sideloadly
- Chọn .ipa file
- Đăng nhập Apple ID
- Nhấn Start

## Yêu cầu hệ thống

- iOS 13+
- iPhone 7 trở lên (có NFC hardware)
- Apple ID (miễn phí)
- Mac/PC cho việc sideload

## Troubleshooting

### Lỗi "Cannot connect to API"
- Kiểm tra URL trong Settings
- Đảm bảo iPhone và server cùng mạng
- Thử ping IP server từ iPhone

### Lỗi "No spools found"
- Kiểm tra Spoolman server đang chạy
- Kiểm tra API URL đúng port
- Xem logs trong app

### NFC không hoạt động
- Cần update `write.tsx` và `read.tsx` sang react-native-nfc-manager
- Kiểm tra app.json có NFCReaderUsageDescription
- Chỉ hoạt động trên iPhone thật (không phải simulator)
