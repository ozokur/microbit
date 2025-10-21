# 🚀 HEMEN YÜKLE - En Kolay Yöntem

Micro:bit'e yüklemek için **3 farklı yöntem**. En kolayı #1:

---

## ✅ Yöntem 1: Online Editor (ÖNERİLEN - 2 DAKİKA)

### Adım 1: Kodu Kopyala
```bash
cat /Users/ozanokur/projeler/microbit/microbit_main.py | pbcopy
```
✅ **Kod panoya kopyalandı!**

### Adım 2: Editor'ü Aç
🔗 https://python.microbit.org/v/3

### Adım 3: Yapıştır
- Editor'deki tüm kodu sil
- ⌘+V (Cmd+V) ile yapıştır

### Adım 4: Yükle
- **"Send to micro:bit"** butonuna tıkla
- USB cihazını seç
- **"Connect"** tıkla
- ✅ Otomatik yüklenecek!

---

## 🔧 Yöntem 2: Manuel Dosya Kopyalama

### Adım 1: Hex Dosyası İndir
Online editor'de:
1. Kodu yapıştır (yukarıdaki gibi)
2. **"Download"** butonuna tıkla
3. `.hex` dosyası inecek

### Adım 2: Kopyala
```bash
# İndirilen hex dosyasını bul (genelde Downloads/)
cp ~/Downloads/microbit*.hex /Volumes/MICROBIT/
```

### Adım 3: Bekle
- Micro:bit sarı LED'i yanıp söner
- 5 saniye içinde yeniden başlayacak
- ✅ Ekranda ❤️ ikonu görmeli

---

## 🐍 Yöntem 3: Python Script (Gelişmiş)

```bash
cd /Users/ozanokur/projeler/microbit

# Python ile hex oluştur ve kopyala
python3 << 'SCRIPT'
import subprocess
import shutil
import time

print("📦 Hex dosyası oluşturuluyor...")
subprocess.run(["/Users/ozanokur/.local/bin/uflash", "microbit_main.py"], 
               capture_output=True)

print("📤 MICROBIT'e kopyalanıyor...")
shutil.copy("microbit.hex", "/Volumes/MICROBIT/")

print("✅ Yükleme tamamlandı!")
print("⏳ Micro:bit yeniden başlatılıyor...")
time.sleep(3)
print("💡 Ekranda ❤️ ikonu görmeli")
SCRIPT
```

---

## ✅ Başarı Kontrolleri

### Micro:bit Ekranı
- ✅ ❤️ (kalp) ikonu sürekli
- ✅ 💓 (küçük kalp) her 2 saniyede yanıp söner

### USB Debug Logları
```bash
screen /dev/tty.usbmodem102 115200
```

Görmeli:
```
=== Micro:bit Temperature Monitor ===
Version: 1.1.0
Button A: Manual temperature reading
Button B: Bluetooth pairing mode
Starting main loop...
```

### B Tuşu Testi
1. Micro:bit'te **B tuşuna** bas
2. Ekranda **"BT"** görmeli
3. Debug log'da pairing talimatları görmeli

---

## 🎯 Hızlı Test

```bash
# Kodu kopyala
cat /Users/ozanokur/projeler/microbit/microbit_main.py | pbcopy

# Editor'ü aç
open "https://python.microbit.org/v/3"

# Sonra:
# 1. Tarayıcıda tüm kodu sil
# 2. Cmd+V ile yapıştır
# 3. "Send to micro:bit" tıkla
# 4. USB cihazı seç
# 5. Connect tıkla
# ✅ HAZIR!
```

---

## 🐛 Sorun mu Var?

### "Send to micro:bit" buton yok
- **Çözüm:** Editor v3 kullanın: https://python.microbit.org/v/3
- Eski versiyonda "Download" kullanın

### USB cihaz görünmüyor
- **Çözüm 1:** USB kablosunu çıkar-tak
- **Çözüm 2:** Micro:bit'i resetle (arka buton)
- **Çözüm 3:** Farklı USB portu dene

### Hex dosyası nerede?
- macOS: `~/Downloads/`
- Dosya adı: `microbit-*.hex` veya `download.hex`

---

## 💡 Pro İpucu

Tek komutla:
```bash
cat /Users/ozanokur/projeler/microbit/microbit_main.py | pbcopy && \
open "https://python.microbit.org/v/3" && \
echo "✅ Kod kopyalandı ve editor açıldı!"
echo "📝 Şimdi: Editor'de Cmd+V ile yapıştır ve 'Send to micro:bit' tıkla"
```

---

**Hangi yöntemi kullanırsanız kullanın, 2-3 dakika içinde hazır! 🚀**

