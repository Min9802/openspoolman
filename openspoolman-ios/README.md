# OpenSpoolMan iOS App

React Native Expo app để viết và đọc NFC tags cho filament spools trên iOS.

## ✨ Tính năng

- ✅ **Viết NFC Tags** - Viết thông tin spool lên NFC tag trực tiếp từ iPhone
- ✅ **Đọc NFC Tags** - Đọc thông tin từ NFC tag đã được viết
- ✅ **iOS Native NFC** - Sử dụng Core NFC framework (iOS 13+)
- ✅ **Không cần app bên thứ ba** - Tất cả trong một app

## 📱 Yêu cầu

- iOS 13.0 trở lên
- iPhone 7 trở lên (hỗ trợ NFC)
- Node.js 18+
- Expo CLI

## 🚀 Cài đặt & Chạy

### 1. Cài dependencies

```bash
cd openspoolman-ios
npm install
```

### 2. Chạy Development Build

**⚠️ Lưu ý:** NFC **KHÔNG hoạt động** với Expo Go. Bạn PHẢI build development client.

```bash
# Cài EAS CLI (nếu chưa có)
npm install -g eas-cli

# Login vào Expo
eas login

# Build development client lần đầu (5-10 phút)
npx expo run:ios

# Hoặc dùng EAS Build
eas build --profile development --platform ios
```

### 3. Start Development Server

Sau khi build development client xong:

```bash
npx expo start --dev-client
```

## 📦 Build Production (.ipa)

### Option 1: Build với EAS (Cloud Build - Khuyên dùng)

```bash
# Build preview (để test)
eas build --platform ios --profile preview

# Build production (cho App Store)
eas build --platform ios --profile production
```

### Option 2: Build Local (Cần Mac + Xcode)

```bash
npx expo run:ios --configuration Release
```

## 📲 Sideload lên iPhone (Không cần App Store)

### Method 1: AltStore (Miễn phí - Khuyên dùng)

1. **Tải AltStore**
   - Windows: https://altstore.io/
   - Cài AltServer trên PC

2. **Cài AltStore lên iPhone**
   - Kết nối iPhone qua USB
   - Mở AltServer → Install AltStore
   - Nhập Apple ID

3. **Sideload App**
   - Download file `.ipa` từ EAS Build
   - Drag & drop `.ipa` vào AltStore trên iPhone
   - Done! ✅

4. **Auto-refresh (Tùy chọn)**
   - Giữ AltServer chạy trên PC
   - Kết nối iPhone cùng WiFi
   - App tự động gia hạn mỗi 7 ngày

### Method 2: Sideloadly (Dễ dùng)

1. Tải Sideloadly: https://sideloadly.io/
2. Kết nối iPhone qua USB
3. Kéo file `.ipa` vào Sideloadly
4. Đăng nhập Apple ID miễn phí
5. Bấm Start → Done!

### Method 3: Apple Developer Account ($99/năm)

- Đăng ký Apple Developer
- Build với certificate 1 năm
- Không cần gia hạn mỗi 7 ngày

## 🛠️ Cấu trúc Project

```
openspoolman-ios/
├── app/
│   ├── _layout.tsx         # Root layout & navigation
│   ├── index.tsx           # Home screen
│   ├── write.tsx           # Write NFC screen
│   ├── read.tsx            # Read NFC screen
│   └── spool-info.tsx      # Spool info display
├── app.json                # Expo config + NFC permissions
├── eas.json                # EAS Build profiles
├── package.json
└── README.md
```

## 🔧 Cấu hình quan trọng

### app.json - NFC Permissions

```json
{
  "ios": {
    "infoPlist": {
      "NFCReaderUsageDescription": "This app needs NFC to read/write spool info",
      "com.apple.developer.nfc.readersession.formats": ["NDEF", "TAG"]
    },
    "entitlements": {
      "com.apple.developer.nfc.readersession.formats": ["NDEF"]
    }
  }
}
```

## 📱 Cách sử dụng

### Viết NFC Tag

1. Mở app → Bấm "Write NFC Tag"
2. Bấm "Start Writing NFC Tag"
3. Đưa iPhone gần NFC tag trống
4. Chờ thông báo "Success!"
5. Done! ✅

### Đọc NFC Tag

1. Mở app → Bấm "Read NFC Tag"
2. Bấm "Start Reading NFC Tag"
3. Đưa iPhone gần NFC tag đã viết
4. Xem thông tin spool
5. Done! ✅

## ⚠️ Lưu ý quan trọng

### NFC không hoạt động?

- ✅ Kiểm tra iPhone hỗ trợ NFC (iPhone 7+)
- ✅ Kiểm tra iOS version (13.0+)
- ✅ KHÔNG dùng Expo Go (không hỗ trợ NFC)
- ✅ Phải build development client hoặc production build
- ✅ Kiểm tra NFC settings trong iPhone (Settings → NFC)

### Sideload bị lỗi?

- ✅ Apple ID có 2FA enabled? → Tạo app-specific password
- ✅ Tin cậy developer: Settings → General → VPN & Device Management
- ✅ Gia hạn mỗi 7 ngày (với Apple ID free)
- ✅ Dùng AltServer auto-refresh để tự động gia hạn

### Build thất bại?

- ✅ Kiểm tra Expo SDK version (phải 52+)
- ✅ Xóa node_modules → npm install lại
- ✅ Bundle identifier unique (thay đổi trong app.json)

## 🔗 Tích hợp với OpenSpoolMan Server

App này được thiết kế để hoạt động với OpenSpoolMan server backend.

**Cập nhật Base URL:**
- Mở app → Nhập URL server (ví dụ: `https://spoolman.local`)
- URL này sẽ được dùng để viết vào NFC tag

**API Endpoints (sẽ implement):**
- `GET /api/spools/:id` - Lấy thông tin spool
- `POST /api/spools/:id/assign` - Assign spool vào AMS slot
- `GET /api/ams/status` - Lấy trạng thái AMS

## 📚 Tài liệu tham khảo

- [Expo NFC](https://docs.expo.dev/versions/latest/sdk/nfc/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [AltStore](https://altstore.io/)
- [Sideloadly](https://sideloadly.io/)

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub:
https://github.com/drndos/openspoolman/issues

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.
