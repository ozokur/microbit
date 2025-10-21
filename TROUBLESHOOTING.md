# 🔧 Troubleshooting Guide

Bu kılavuz, Micro:bit Sıcaklık İzleme Sistemi ile ilgili yaygın sorunları ve çözümlerini içerir.

## 🔌 Bağlantı Sorunları

### Micro:bit USB'den Tanınmıyor

**Belirtiler:**
- `/dev/tty.usbmodem*` cihazı bulunamıyor
- uflash "No micro:bit detected" hatası veriyor

**Çözümler:**
1. USB kablosunun veri destekli olduğundan emin olun (bazı kablolar sadece şarj içindir)
2. USB kablosunu çıkarıp tekrar takın
3. Farklı bir USB portunu deneyin
4. Micro:bit'i resetleyin (arkadaki butona basın)
5. Bilgisayarınızı yeniden başlatın

**Kontrol komutu:**
```bash
ls -la /dev/tty.usb* /dev/cu.usb*
```

### Program Yüklenmiyor

**Belirtiler:**
- uflash komutu hata veriyor
- Micro:bit ekranı boş

**Çözümler:**
1. uflash'ın güncel olduğundan emin olun:
   ```bash
   pipx upgrade uflash
   ```
2. Manuel yükleme deneyin:
   ```bash
   # Python ile hex dosyası oluştur
   python -m uflash microbit_main.py -o microbit.hex
   # Hex dosyasını Micro:bit sürücüsüne kopyala
   cp microbit.hex /Volumes/MICROBIT/
   ```
3. Micro:bit'i firmware güncelleme moduna alın:
   - Reset butonuna basılı tutun
   - USB'yi takın
   - `MAINTENANCE` modu görmelisiniz

## 📡 Bluetooth Sorunları

### Web Bluetooth Çalışmıyor

**Belirtiler:**
- "Bağlan" butonu çalışmıyor
- "Web Bluetooth API desteklenmiyor" hatası

**Çözümler:**
1. Desteklenen tarayıcı kullanın:
   - ✅ Chrome 56+
   - ✅ Edge 79+
   - ✅ Opera 43+
   - ❌ Firefox (desteklemiyor)
   - ❌ Safari (desteklemiyor)

2. HTTPS veya localhost üzerinden erişin:
   ```bash
   # Localhost ile çalıştırın
   python3 -m http.server 8000
   # Tarayıcıda: http://localhost:8000
   ```

3. Tarayıcıda Bluetooth'un etkin olduğundan emin olun:
   - Chrome: `chrome://flags/#enable-web-bluetooth`
   - Sistem Bluetooth ayarlarını kontrol edin

### Micro:bit Eşleşme Listesinde Görünmüyor

**Belirtiler:**
- "Bağlan" butonuna basıldığında Micro:bit görünmüyor

**Çözümler:**
1. Micro:bit'in çalıştığından emin olun (ekranda kalp ikonu)
2. Micro:bit'i resetleyin
3. Bluetooth eşleştirmesini temizleyin:
   - Sistem Ayarları → Bluetooth
   - Eski "BBC micro:bit" cihazlarını kaldırın
4. Micro:bit'te Bluetooth pairing moduna girin:
   ```
   - A+B butonlarına basılı tutun
   - Reset butonuna basın
   - Eşleştirme animasyonu göreceksiniz
   ```

### Bağlantı Kuruluyor Ama Veri Gelmiyor

**Belirtiler:**
- "Bağlı" durumu görünüyor
- Sıcaklık değerleri "--" olarak kalıyor

**Çözümler:**
1. Debug log'u kontrol edin
2. USB seri port üzerinden Micro:bit loglarını kontrol edin:
   ```bash
   screen /dev/tty.usbmodem* 115200
   # Çıkmak için: CTRL+A, sonra K, sonra Y
   ```
3. Micro:bit programını yeniden yükleyin
4. Tarayıcıyı yeniden başlatın ve tekrar bağlanın
5. Micro:bit'i resetleyin

## 🐛 Debug ve Log Sorunları

### Seri Port Logları Görünmüyor

**macOS için:**
```bash
# Seri portu bulun
ls /dev/tty.usbmodem*

# Screen ile bağlanın
screen /dev/tty.usbmodem102 115200

# Alternatif: cat ile okuyun
cat /dev/tty.usbmodem102

# Çıkmak için: CTRL+A, sonra K, sonra Y
```

**Windows için:**
```powershell
# COM portunu Aygıt Yöneticisi'nden bulun
# PuTTY, TeraTerm veya Arduino Serial Monitor kullanın
# Baud rate: 115200
```

**Linux için:**
```bash
# Kullanıcıyı dialout grubuna ekleyin
sudo usermod -a -G dialout $USER
# Çıkış yapıp tekrar giriş yapın

# Seri portu bulun
ls /dev/ttyACM*

# Screen ile bağlanın
screen /dev/ttyACM0 115200
```

### Debug Log Paneli Boş

**Çözümler:**
1. Tarayıcı konsolunu açın (F12) ve hataları kontrol edin
2. JavaScript hatalarını kontrol edin
3. Tarayıcı cache'ini temizleyin (CTRL+Shift+R)
4. Dosyaların doğru yüklendiğini kontrol edin:
   ```
   Network sekmesinde:
   - index.html
   - app.js
   - chart.js
   - styles.css
   - CHANGELOG.md
   ```

## 📊 Grafik Sorunları

### Grafik Görünmüyor

**Çözümler:**
1. Canvas elementinin yüklendiğini kontrol edin
2. Tarayıcı konsolunda JavaScript hatalarını kontrol edin
3. Veri geldiğinden emin olun (Debug log'u kontrol edin)
4. Sayfa boyutunu değiştirmeyi deneyin (window resize)

### Grafik Donuyor veya Yavaş

**Çözümler:**
1. "Grafiği Temizle" butonuna basın
2. Tarayıcı sekmesini kapatıp yeniden açın
3. Veri noktası sayısını azaltın (`chart.js` içinde `maxDataPoints`)
4. Tarayıcı donanım hızlandırmasını etkinleştirin

## 🔄 Genel Sorun Giderme Adımları

1. **Micro:bit'i Resetleyin**
   - Arkadaki reset butonuna basın
   - 5 saniye bekleyin
   - Kalp ikonu görünmeli

2. **Programı Yeniden Yükleyin**
   ```bash
   cd /Users/ozanokur/projeler/microbit
   ./test_connection.sh
   ```

3. **Tarayıcıyı Yeniden Başlatın**
   - Tüm sekmeleri kapatın
   - Tarayıcıyı tamamen kapatın
   - Yeniden açın ve http://localhost:8000 adresine gidin

4. **Sistemi Yeniden Başlatın**
   - Bilgisayarı yeniden başlatın
   - Bluetooth'u yeniden etkinleştirin
   - Micro:bit'i yeniden bağlayın

## 📝 Test Checklist

Sisteminizi test etmek için:

- [ ] Micro:bit USB'ye bağlı mı?
- [ ] Micro:bit ekranında kalp ikonu var mı?
- [ ] Web sunucusu çalışıyor mu? (`python3 -m http.server 8000`)
- [ ] Tarayıcı destekleniyor mu? (Chrome/Edge)
- [ ] Localhost kullanılıyor mu? (`http://localhost:8000`)
- [ ] Bluetooth açık mı?
- [ ] Debug log'da mesajlar görünüyor mu?
- [ ] Seri port logları geliyor mu?

## 🆘 Hala Sorun mu Var?

Detaylı log almak için:

```bash
# 1. Web sunucusunu başlatın
python3 -m http.server 8000

# 2. Yeni terminal açın ve seri port'u izleyin
screen /dev/tty.usbmodem102 115200

# 3. Tarayıcı konsolunu açın (F12)
# 4. Network sekmesini açın
# 5. Console sekmesinde hataları kontrol edin
```

Tüm logları kaydedin ve hatayı raporlayın:
- Tarayıcı konsol çıktısı
- Seri port çıktısı
- Debug log paneli içeriği
- Sistem bilgileri (OS, tarayıcı versiyonu)

## 🔍 İleri Seviye Debug

### Bluetooth UART Test

```python
# Python ile Bluetooth bağlantısını test edin
# test_bluetooth.py

import asyncio
from bleak import BleakScanner, BleakClient

UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
UART_TX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

async def scan():
    devices = await BleakScanner.discover()
    for d in devices:
        if "micro:bit" in d.name.lower():
            print(f"Found: {d.name} - {d.address}")

asyncio.run(scan())
```

### MicroPython REPL

```bash
# REPL'e bağlanın
screen /dev/tty.usbmodem102 115200

# CTRL+C ile programı durdurun
# REPL prompt'u (>>>) görmelisiniz
# Komutları test edin:
>>> import microbit
>>> microbit.temperature()
```

## 📚 Faydalı Linkler

- [Micro:bit Python Editor](https://python.microbit.org/)
- [Web Bluetooth API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Micro:bit Bluetooth Services](https://lancaster-university.github.io/microbit-docs/ble/profile/)
- [uflash Documentation](https://uflash.readthedocs.io/)

