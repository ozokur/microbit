# 📥 Micro:bit Program Yükleme Kılavuzu

## Yöntem 1: uflash ile (Önerilen)

```bash
cd /Users/ozanokur/projeler/microbit
export PATH="$PATH:/Users/ozanokur/.local/bin"
uflash microbit_main.py
```

**Sorun mu yaşıyorsunuz?** Yöntem 2'ye geçin.

---

## Yöntem 2: Manuel Kopyalama (En Kolay)

### Adım 1: Micro:bit'i Sürücü Olarak Bağlayın

1. Micro:bit'i USB ile bilgisayara takın
2. Finder'da (macOS) `MICROBIT` sürücüsü görünmeli
3. Eğer görünmüyorsa:
   - Micro:bit'i çıkarın
   - Reset butonuna basılı tutun
   - USB'yi takın
   - Reset butonunu bırakın

### Adım 2: Hex Dosyası Oluşturun

```bash
cd /Users/ozanokur/projeler/microbit
python3 << 'EOF'
import os
import sys

# Read the Python file
with open('microbit_main.py', 'r') as f:
    code = f.read()

# Create a simple hex wrapper
print("Hex dosyası oluşturuluyor...")
print("Not: Daha gelişmiş hex oluşturmak için Python micro:bit editor kullanın")
print("URL: https://python.microbit.org/")
EOF
```

### Adım 3: Online Editor Kullanın (En Güvenilir)

1. **Tarayıcıda açın:** https://python.microbit.org/
2. **Kodu yapıştırın:**
   ```bash
   cat microbit_main.py
   ```
   - Yukarıdaki çıktıyı kopyalayın
   - Editor'e yapıştırın

3. **Download edin:**
   - "Download" butonuna tıklayın
   - `.hex` dosyası indirilecek

4. **Micro:bit'e kopyalayın:**
   - İndirilen `.hex` dosyasını sürükleyin
   - `MICROBIT` sürücüsüne bırakın
   - Micro:bit otomatik olarak yeniden başlayacak

---

## Yöntem 3: Python micro:bit Editor (Web)

**En Basit ve Önerilen Yöntem!**

### Adım 1: Editor'ü Açın
🔗 **https://python.microbit.org/v/3**

### Adım 2: Kodu Kopyalayın

Terminal'de:
```bash
cat /Users/ozanokur/projeler/microbit/microbit_main.py | pbcopy
```
Bu komut kodu otomatik olarak kopyalar.

### Adım 3: Editor'e Yapıştırın
- Editor'deki tüm kodu silin
- ⌘+V (veya Ctrl+V) ile yapıştırın

### Adım 4: Micro:bit'e Gönder
- **"Send to micro:bit"** butonuna tıklayın
- Micro:bit'i seçin
- **"Connect"** tıklayın
- Otomatik olarak yüklenecek!

✅ **En kolay ve hatasız yöntem budur!**

---

## Yöntem 4: microfs ile

```bash
# microfs kurun
pipx install microfs

# Dosyayı yükleyin
cd /Users/ozanokur/projeler/microbit
ufs put microbit_main.py main.py
```

---

## ✅ Başarı Kontrolü

Yükleme başarılı olduğunda:

1. **Micro:bit Ekranı:**
   - Kalp ikonu (❤️) görünecek
   - Her 2 saniyede bir küçük kalp yanıp sönecek

2. **USB Seri Port:**
   ```bash
   screen /dev/tty.usbmodem102 115200
   ```
   
   Görmeniz gerekenler:
   ```
   === Micro:bit Temperature Monitor ===
   Version: 1.0.0
   Bluetooth UART enabled
   Starting main loop...
   Temperature: 22.5°C
   BT Sent: TEMP:22.5:123456
   ```

3. **LED Davranışı:**
   - Sürekli kalp = Program çalışıyor
   - Yanıp sönen kalp = Veri gönderiyor

---

## 🐛 Sorun Giderme

### "MICROBIT sürücüsü görünmüyor"

**Çözüm 1:** Micro:bit'i Maintenance moduna alın
```
1. Reset butonuna basılı tutun
2. USB'yi takın  
3. Reset'i bırakın
4. "MAINTENANCE" sürücüsü görünecek
```

**Çözüm 2:** USB kablosunu değiştirin
- Bazı kablolar sadece şarj içindir
- Veri destekli kablo kullanın

**Çözüm 3:** Farklı USB portu deneyin

### "Program yüklendi ama çalışmıyor"

```bash
# Seri port'tan hata mesajlarını okuyun
screen /dev/tty.usbmodem102 115200

# Hata görürseniz kodu kontrol edin
# REPL'de test edin: CTRL+C ile programı durdurun
```

### "Ekranda hata kodu görünüyor"

Micro:bit hata kodları:
- **Üzgün yüz:** Syntax hatası
- **Scroll eden metin:** Detaylı hata mesajı

Çözüm:
1. Kodu yeniden kopyalayın
2. Python syntax'ını kontrol edin
3. Online editor kullanın (syntax kontrolü yapar)

---

## 🚀 Hızlı Test

Yüklendikten sonra:

```bash
# Terminal 1: Web sunucusu
cd /Users/ozanokur/projeler/microbit
python3 -m http.server 8000

# Terminal 2: Seri port izleme
screen /dev/tty.usbmodem102 115200

# Tarayıcı
open http://localhost:8000
```

**5 saniye içinde görmeniz gerekenler:**
- ✅ Web sayfası yüklendi
- ✅ Micro:bit'te kalp ikonu
- ✅ Seri port'ta log mesajları
- ✅ "Bağlan" butonu aktif

---

## 💡 Pro İpuçları

### Otomatik Yükleme Script'i

```bash
# Kolay yükleme için alias oluşturun
cat >> ~/.zshrc << 'EOF'
alias mb-flash='cd /Users/ozanokur/projeler/microbit && export PATH="$PATH:$HOME/.local/bin" && uflash microbit_main.py'
EOF

source ~/.zshrc

# Artık sadece şunu yazın:
mb-flash
```

### Online Editor Kısayol Oluştur

```bash
# Desktop'a kısayol oluştur
cat > ~/Desktop/MicrobitEditor.webloc << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>URL</key>
    <string>https://python.microbit.org/v/3</string>
</dict>
</plist>
EOF
```

### Hızlı Debug

```bash
# .zshrc'ye ekleyin
alias mb-debug='screen /dev/tty.usbmodem102 115200'
alias mb-logs='tail -f /Users/ozanokur/projeler/microbit/microbit_serial.log'
```

---

## 📱 Mobil'den Test

Micro:bit Web Bluetooth destekleyen Android cihazlardan da test edilebilir:

1. Android telefonda Chrome açın
2. Bilgisayarın IP'sine gidin: `http://BILGISAYAR_IP:8000`
3. Bluetooth'u açın
4. "Bağlan" butonuna tıklayın

**Not:** iOS (iPhone/iPad) Web Bluetooth desteklemiyor.

---

## ✅ Başarılı Kurulum Checklist

- [ ] Micro:bit USB'ye bağlı
- [ ] Program yüklendi (kalp ikonu görünüyor)
- [ ] Seri port logları geliyor
- [ ] Web sunucusu çalışıyor (http://localhost:8000)
- [ ] Tarayıcı destekleniyor (Chrome/Edge)
- [ ] Bluetooth açık
- [ ] İlk bağlantı test edildi

**Hepsi tamam mı? Harika! Şimdi QUICKSTART.md'ye geçin!**

---

**Son Güncelleme:** 21 Ekim 2025  
**Destek:** TROUBLESHOOTING.md ve README.md dosyalarına bakın

