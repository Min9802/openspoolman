# Quick Start Guide - OpenSpoolMan iOS

## 🚀 Bắt đầu nhanh (Windows)

### Bước 1: Cài đặt

```powershell
cd z:\3D_print\openspoolman\openspoolman-ios
npm install
npm install -g eas-cli
eas login
```

### Bước 2: Build App (.ipa)

```powershell
# Build preview cho test (10-20 phút)
eas build --platform ios --profile preview
```

Sau khi build xong, download file `.ipa` từ link EAS cung cấp.

### Bước 3: Cài lên iPhone

#### Option A: AltStore (Miễn phí - Auto-refresh)

1. **Tải & Cài AltServer** (Windows)
   - https://altstore.io/
   - Cài AltServer trên PC Windows
   - Cài iTunes (nếu chưa có)

2. **Cài AltStore lên iPhone**
   - Kết nối iPhone qua USB
   - Mở AltServer từ System Tray (góc dưới phải)
   - Install AltStore → Chọn iPhone
   - Nhập Apple ID & password

3. **Cài App**
   - Mở AltStore trên iPhone
   - My Apps → "+" (góc trên)
   - Chọn file `.ipa` đã download
   - Done! ✅

4. **Auto-refresh (Không bị expire 7 ngày)**
   - Giữ AltServer chạy trên PC
   - iPhone và PC cùng WiFi
   - AltStore tự động refresh app

#### Option B: Sideloadly (Dễ dùng - Manual refresh)

1. **Tải Sideloadly**
   - https://sideloadly.io/
   - Cài trên Windows

2. **Sideload**
   - Mở Sideloadly
   - Kết nối iPhone qua USB
   - Kéo file `.ipa` vào Sideloadly
   - Nhập Apple ID
   - Start → Done!

3. **Gia hạn (Mỗi 7 ngày)**
   - Repeat bước 2

### Bước 4: Tin cậy Developer

Lần đầu mở app sẽ báo lỗi "Untrusted Developer":

```
Settings → General → VPN & Device Management
→ Chọn Apple ID email của bạn
→ Trust
```

### Bước 5: Sử dụng

1. Mở app "OpenSpoolMan iOS"
2. Write NFC Tag → Start Writing → Đưa iPhone gần tag
3. Done! ✅

## 🔧 Development (Cho dev)

Nếu bạn muốn develop/modify app:

```powershell
# Build development client (lần đầu - 10 phút)
npx expo run:ios

# Sau đó start dev server
npx expo start --dev-client
```

## ⚠️ Troubleshooting

### "NFC Not Supported"
- iPhone 7 trở lên
- iOS 13 trở lên

### "Untrusted Developer"
- Settings → General → Device Management → Trust

### App bị expire sau 7 ngày
- Dùng AltStore với auto-refresh
- Hoặc mua Apple Developer ($99/năm)

### Build failed
```powershell
rm -rf node_modules
npm install
eas build --platform ios --profile preview --clear-cache
```

## 📞 Hỗ trợ

Tạo issue: https://github.com/drndos/openspoolman/issues
